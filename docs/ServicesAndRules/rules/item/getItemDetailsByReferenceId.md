# getItemDetailsByReferenceId

Valida os dados necessários para obter os detalhes de uma referência de item.

## Entrada

```ts
{
    item_reference_id: ItemValues["item_reference_id"];
    referenceIdExists: boolean;
}
```

## Validações

1. O identificador da referência deve ser informado.
2. A referência deve existir.

Retorna `success(item_reference_id)` quando as validações passam, ou `failure(message)` na primeira validação que falhar. A regra não consulta o banco de dados.
