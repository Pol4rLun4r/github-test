# getFull

Valida os dados necessários para obter uma cotação completa.

Esta regra garante que a cotação solicitada possa ser consultada antes da execução da busca.

## Objetivo

Validar a consulta de uma cotação completa.

A regra não realiza consultas ao banco de dados. Sua responsabilidade é apenas validar os dados recebidos.

As regras da entidade podem ser consultadas em [quotations](Database/quotations).

## Entrada

### Payload

```ts
{
    quotation_id: Quotation['id'];
    quotationExists: boolean;
}
```

## Saída

Em caso de sucesso:

```ts
success(quotation_id)
```

Em caso de erro:

```ts
failure(ErrorCode)
```

## Validações

A regra executa as seguintes validações:

1. O identificador da cotação (`quotation_id`) deve ser informado.
    
2. A cotação deve existir.
    

A primeira validação que falhar interrompe a execução da regra.

## Normalizações

Esta regra não realiza normalizações.

## Garantias

Quando a regra retorna sucesso:

- o identificador da cotação é válido;
    
- a cotação existe e pode ser consultada.
    

## Códigos de erro

| Código                      | Descrição                                     |
| --------------------------- | --------------------------------------------- |
| `QUOTATION_ID_NOT_INFORMED` | O identificador da cotação não foi informado. |
| `QUOTATION_NOT_FOUND`       | A cotação informada não existe.               |