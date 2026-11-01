# Rules example

Exemplo de código de um arquivo `rules`

> [!Warning] Atenção
> Note que estes exemplos podem não ser coerentes com uma regra real de negócio. Eles não representam necessariamente código funcional; servem apenas para explicar conceitos específicos.
## Exemplo 1: nome do arquivo e localização

O arquivo deve ter o nome do `service`, por exemplo `createClient` + o prefixo `rules`:
**Resultado**: `createClient.rules.ts`

O arquivo deve residir no seguinte local:
> `/src/electron/rules/[client | item | quotation]/[nomeDoArquivo].rules.ts`

**Exemplo completo:**
> `/src/electron/rules/client/createClient.rules.ts`

## Exemplo 2: `rule` que recebe apenas dados

Por padrão o `rule`, vai tratar apenas dados básicos enviados pelo cliente, sem precisar de consultas externas ao banco de dados.

```ts
//  createClient.rules.ts

// type
interface CreateClient extends Omit<Client, "id"> {};

const createClientRules = ({ document, name, notes, type_client }: CreateClient) => {
	// checar se o nome foi informado
    if (cleanedName.length === 0) {
        return failure('Nome é obrigatório');
    }

    // checar se o documento foi informado
    if (cleanedDocument.length === 0) {
        return failure('Documento é obrigatório');
    }

    // checar se o documento é válido
    if (!validateDocument(cleanedDocument)) {
        return failure('Informe um documento válido');
    }

    // checar o tipo do cliente
    if (type_client !== 'internacional' && type_client !== 'nacional') {
        return failure('Por favor, especifique o tipo do cliente. Internacional ou Nacional')
    }

    const data: Client = {
        name: cleanedName,
        document: cleanedDocument,
        type_client: cleanedTypeClient as ClientType,
        notes: notes?.length !== 0 ? notes : undefined,
    }

    return success(data);
};

export const cleanDocument = (document: string | undefined) => {
    if(!document) return undefined;
    return onlyNumbers(document);
};

export default createClientRules;
```

## Exemplo 3: `rule` que recebe dados e resultados

Em casos onde `rule` precisa de informações do banco de dados, ele não deve consultar o banco diretamente, mas sim usar o `service` para isso, no caso ele irá esperar o resultado de consulta que o `service` faz ao banco, e irá tratar isso, no exemplo abaixo, o service traz o resultado de duas consultas a mais, sendo eles `clientExistsByDocument` e `clientExistsById`

```ts
// utils
import { success, failure } from "../../utils/handleSuccess.js";
import { onlyNumbers, onlyName } from "../../utils/clean.js";
import { validateDocument } from "../../utils/documentValidator.js";

// type
interface CreateClient extends Omit<Client, "id"> {
    clientExistsByDocument?: Client | undefined
    clientExistsById?: Client | undefined
};

const createClientRules = ({ clientExistsById, clientExistsByDocument, document, name, notes, type_client }: CreateClient) => {
    const cleanedName = onlyName(name)
    const cleanedDocument = onlyNumbers(document);
    const cleanedTypeClient = onlyName(type_client as string);

    // verifica se cliente existe baseado no id
    if (clientExistsById) {
        return success(clientExistsById, 'CLIENT_EXISTS_BY_ID');
    }

    // verifica se cliente existe baseado no documento
    if (clientExistsByDocument) {
        return success(clientExistsByDocument, 'CLIENT_EXISTS_BY_DOCUMENT');
    }

    // checar se o nome existe
    if (cleanedName.length === 0) {
        return failure('Nome é obrigatório');
    }

    // checar se o documento existe
    if (cleanedDocument.length === 0) {
        return failure('Documento é obrigatório');
    }

    // checar se o documento é válido
    if (!validateDocument(cleanedDocument)) {
        return failure('Informe um documento válido');
    }

    // checar o tipo do cliente
    if (type_client !== 'internacional' && type_client !== 'nacional') {
        return failure('Por favor, especifique o tipo do cliente. Internacional ou Nacional')
    }

    const data: Client = {
        name: cleanedName,
        document: cleanedDocument,
        type_client: cleanedTypeClient as ClientType,
        notes: notes?.length !== 0 ? notes : undefined,
    }

    return success(data);
};

export const cleanDocument = (document: string | undefined) => {
    if(!document) return undefined;
    return onlyNumbers(document);
};

export default createClientRules;
```

## Exemplo 4: `rule` com casos especiais

Em alguns determinados `rules`, pode acontecer de querer  que o `service` trate os dados revisados por `rule` de forma diferente, neste caso usamos "códigos", no exemplo abaixo, temos dois casos especiais, onde quero que meu `rule` de um resultado diferente, baseado nestes "códigos":

```ts
//  createClient.rules.ts
	
	//... código acima oculto
	
    // verifica se cliente existe baseado no id
    if (clientExistsById) {
        return success(clientExistsById, 'CLIENT_EXISTS_BY_ID');
    }

    // verifica se cliente existe baseado no documento
    if (clientExistsByDocument) {
        return success(clientExistsByDocument, 'CLIENT_EXISTS_BY_DOCUMENT');
    }
	
	//... código abaixo oculto
```

Como mostrado no exemplo, meu `success`, recebe valores diferentes, junto aos códigos informados, o código sempre deve seguir este estilo: caixa alta e palavras separadas por underline.

Estes códigos serve para "guiar" o `service`, sobre o que ele deve fazer, abaixo o seguinte exemplo de  como o `service` trata esses "códigos":

**código completo**

```ts
// createCliente.service.ts

// types
import type { Database } from "better-sqlite3";

// repositories
import { createRepositories } from "../../repositories/index.js";

// rules
import createClientRules, { cleanDocument } from "../../rules/client/createClient.rules.js";

// utils
import { success } from "../../utils/handleSuccess.js";

const createClientService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: Client) => {
        const clientExistsByDocument = repo.client.getByDocument(cleanDocument(data.document))

        const result = createClientRules({ clientExistsByDocument, ...data });

        // any errors
        if (!result.success) {
            return result;
        }

        // se o cliente existir baseado no documento
        if (result.code === 'CLIENT_EXISTS_BY_DOCUMENT') {
            return result;
        }
		
		// se o cliente existir baseado no id
        if (result.code === 'CLIENT_EXISTS_BY_ID') {
			const createdClient = repo.client.create(result.data);
			return success(createdClient);
        }
		
        const createdClient = repo.client.create(result.data);

        return success(createdClient);
    });
};

export default createClientService;
```

**destaque do tratamento dos códigos**

```ts
	// se o cliente existir baseado no documento
	if (result.code === 'CLIENT_EXISTS_BY_DOCUMENT') {
		return result;
	}
	
	// se o cliente existir baseado no id
	if (result.code === 'CLIENT_EXISTS_BY_ID') {
		const createdClient = repo.client.create(result.data);
		return success(createdClient);
	}
```

Como é possível analisar, o `service` trata o resultado de `rule` de forma diferente, baseado nesses códigos.