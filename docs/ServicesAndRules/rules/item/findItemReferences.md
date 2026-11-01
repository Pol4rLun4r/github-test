# findItemReferences

Determina como a busca de itens de referência deve ser realizada.

Esta regra identifica se a consulta deve retornar todos os itens cadastrados ou apenas os itens que correspondam ao termo informado.

## Objetivo

Definir o modo de pesquisa dos itens de referência.

A regra não realiza consultas ao banco de dados. Sua responsabilidade é apenas interpretar o termo de pesquisa e indicar qual estratégia de busca deve ser utilizada.

## Entrada

### Payload

```ts
SearchItemDescriptionIsOptional
```

O termo de pesquisa é opcional.

## Saída

Em caso de sucesso:

```ts
success(SearchItemDescriptionIsOptional, code?)
```

Quando nenhum filtro for informado, a regra retorna o código:

```text
GET_ALL
```

Esse código indica que todos os itens devem ser retornados.

## Validações

Esta regra não possui validações.

## Normalizações

Antes de retornar sucesso, a regra realiza as seguintes normalizações:

### Termo de pesquisa

- Remove espaços em branco do início e do fim do texto.
    

## Fluxo determinado

A regra determina um dos seguintes comportamentos:

- Caso nenhum termo seja informado (`undefined`), todos os itens devem ser retornados.
    
- Caso o termo informado seja uma string vazia ou contenha apenas espaços em branco, todos os itens devem ser retornados.
    
- Caso exista um termo válido, a pesquisa deve ser realizada utilizando esse termo.
    

## Garantias

Quando a regra retorna sucesso:

- sempre existe uma estratégia de busca definida;
    
- o serviço consegue determinar se deve retornar todos os itens ou realizar uma pesquisa filtrada;
    
- quando um filtro é utilizado, o termo de pesquisa encontra-se normalizado.
    

## Códigos

|Código|Descrição|
|---|---|
|`GET_ALL`|Indica que a consulta deve retornar todos os itens cadastrados, sem aplicar filtros.|