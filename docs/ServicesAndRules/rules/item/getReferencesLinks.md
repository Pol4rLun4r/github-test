# getReferenceLinks

Valida os dados necessários para obter os links de referência de um item.

Esta regra garante que a referência do item exista antes da consulta dos seus links.

## Objetivo

Validar a consulta dos links associados a um item de referência.

A regra não realiza consultas ao banco de dados. Sua responsabilidade é apenas validar os dados recebidos.

As regras da entidade podem ser consultadas em [[item_references]] e [[reference_links]].

## Entrada

### Payload

```ts
{
    item_reference_id: GetReferenceLinks;
    itemReferenceExists: boolean;
}
```

## Saída

Em caso de sucesso:

```ts
success(item_reference_id)
```

Em caso de erro:

```ts
failure(ErrorCode)
```

## Validações

A regra executa as seguintes validações:

1. O identificador do item de referência (`item_reference_id`) deve ser informado.
    
2. O item de referência deve existir.
    

A primeira validação que falhar interrompe a execução da regra.

## Normalizações

Esta regra não realiza normalizações.

## Garantias

Quando a regra retorna sucesso:

- o identificador do item de referência é válido;
    
- o item de referência existe e pode ser consultado.
    

## Códigos de erro

| Código                           | Descrição                                                |
| -------------------------------- | -------------------------------------------------------- |
| `ITEM_REFERENCE_ID_NOT_INFORMED` | O identificador do item de referência não foi informado. |
| `ITEM_REFERENCE_NOT_FOUND`       | O item de referência informado não existe.               |