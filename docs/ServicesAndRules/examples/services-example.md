# Services example

Exemplo de código de um arquivo `service`


> [!Warning] Atenção
> Note que estes exemplos podem não ser coerentes com uma regra real de negócio. Eles não representam necessariamente código funcional; servem apenas para explicar conceitos específicos.
## Exemplo 1: nome do arquivo e localização

O arquivo deve ter o nome baseado em sua intenção, por exemplo "criar uma cotação", `createQuotation` + o prefixo `service`

**Resultado**: `createQuotation.service.ts`

O arquivo deve residir no seguinte local:
> `/src/electron/services/[client | item | quotation]/[nomeDoArquivo].service.ts`

**Exemplo completo:**
> `/src/electron/services/quotation/createQuotation.service.ts`

## Exemplo 2: `service` que espera dados

Em determinados services, eles esperam dados, a forma de escrita do código deve ser a seguinte:

```ts
// types
import type { Database } from "better-sqlite3";

// rules
import createQuotationRules from "../../rules/quotation/createQuotation.rules.js";

// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const createQuotationService = (db: Database) => {
    const repo = createRepositories(db);

    return db.transaction((data: CreateQuotation) => {
        const clientExists = repo.client.getById(data?.client_id);

        const result = createQuotationRules({clientExists, ...data});

        // any errors
        if(!result.success) {
            return result;
        }

        const createQuotation = repo.quotation.create(result.data);

        const quotation = repo.quotation.getByVersionId(createQuotation);

        return success(quotation);
    });
};

export default createQuotationService;
```

Note que os dados são informados na segunda função dentro do `service`, que seria o `(data: CreateQuotation)`

## Exemplo 3: `service` que não espera dados

Em determinados services, eles não esperam dados, a forma de escrita do código deve ser a seguinte:

```ts
// database
import type { Database } from "better-sqlite3";

// utils
import { success, failure } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const getAllQuotationsSummaryService = (db: Database) => () => {
    const repo = createRepositories(db);

    const quotations = repo.quotation.getAllSummary();

    if(!quotations) {
        return failure("Nenhuma cotação encontrada")
    }

    return success(quotations);
};

export default getAllQuotationsSummaryService;
```

Note que aqui, na segunda função, os dados não são informados, pois este `service` apenas puxa dados do banco sem precisar de algo para isso. 