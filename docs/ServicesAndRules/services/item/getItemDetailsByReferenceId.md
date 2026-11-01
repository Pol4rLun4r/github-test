# getItemDetailsByReferenceId

Retorna os detalhes de uma referência de item: os dados principais e seus links, a quantidade de registros de `item_values` e o registro mais recente.

## Entrada

```ts
item_reference_id: ItemValues["item_reference_id"]
```

## Saída

Em caso de sucesso, retorna `success(ItemDetails)` com:

- `item_with_reference_links`: dados da referência e todos os seus links;
- `item_values_records`: quantidade total de registros em `item_values`;
- `latest_price`: registro completo de `item_values` com a data de criação mais recente, ou `undefined` quando ainda não há registros.

Em caso de erro, retorna `failure(message)` se o identificador não for informado ou se a referência não existir.

## Regras e repositórios

A regra `getItemDetailsByReferenceId` valida o identificador e a existência da referência. O serviço consulta, nesta ordem:

1. `item.reference.getById`, que retorna a referência com os `reference_links`;
2. `item.values.getLatestByReferenceId`, que ordena por `created_at` decrescente e desempata pelo maior `id`;
3. `item.values.countByReferenceId`, que conta todos os registros, sem limite de paginação.

As consultas são executadas na transação do serviço. Uma referência existente sem valores retorna sucesso, com `item_values_records: 0` e `latest_price: undefined`.
