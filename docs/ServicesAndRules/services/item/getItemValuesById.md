# getItemValuesById

Retorna um registro completo de `item_values` com base no seu identificador.

## Entrada

```ts
item_values_id: ItemValues["id"]
```

## Saída

Em caso de sucesso, retorna `success(ItemValues)` com o registro encontrado.
Em caso de erro, retorna `failure(message)` quando o identificador não é informado,
é inválido ou não corresponde a um registro existente.

## Regras e repositórios

A regra `getItemValuesById` valida o identificador e a existência do registro.
O serviço consulta `item.values.getById` dentro de uma transação.
