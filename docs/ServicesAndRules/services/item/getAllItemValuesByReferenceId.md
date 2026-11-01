# getAllItemValuesByReferenceId

Obtém todas as configurações de valores associadas a um item de referência.

Este serviço retorna todos os registros de `item_values` pertencentes a um determinado `item_reference`.

## Objetivo

Consultar todas as configurações de valores cadastradas para um item de referência.

Este serviço deve ser utilizado quando for necessário listar ou reutilizar os conjuntos de valores disponíveis para um item.

## Dependências

O serviço utiliza:

- [[item_references]]
    
- [[item_values]]
    

## Entrada

### Payload

```ts
item_reference_id: ItemValues['item_reference_id']
```

Representa o identificador do item de referência.

## Saída

Em caso de sucesso:

```ts
success(ItemValues[])
```

O retorno contém todas as configurações de valores associadas ao item de referência.
Cada configuração pode incluir o prazo de entrega opcional (`delivery`), em dias.

Caso não existam registros cadastrados, o retorno será uma coleção vazia.

Em caso de erro:

```ts
failure(message)
```

## Regras utilizadas

- `getAllItemValuesByReferenceId`
    

## Fluxo

1. Verificar se o item de referência existe.
    
2. Aplicar a regra [getAllItemValuesByReferenceId](ServicesAndRules/rules/item/getAllItemValuesByReferenceId).
    
3. Consultar todas as configurações de valores associadas ao item de referência.
    
4. Retornar os registros encontrados.
    

## Garantias

Quando o serviço retorna sucesso:

- o item de referência existe;
    
- todas as configurações de valores pertencentes ao item de referência são retornadas;
    
- caso não existam configurações cadastradas, uma coleção vazia é retornada.
    

## Erros conhecidos

| Código                        | Quando ocorre                                            |
| ----------------------------- | -------------------------------------------------------- |
| `ITEM_REFERENCE_NOT_INFORMED` | O identificador do item de referência não foi informado. |
| `ITEM_REFERENCE_NOT_EXISTS`   | O item de referência informado não existe.               |