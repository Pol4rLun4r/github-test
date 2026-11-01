# getQuotationFull

Obtém todos os dados de uma cotação.

Este serviço retorna a cotação completa, incluindo seus itens, valores e demais informações relacionadas.

## Objetivo

Consultar uma cotação completa a partir do seu identificador.

Este serviço deve ser utilizado sempre que for necessário visualizar ou editar uma cotação.

## Dependências

O serviço utiliza:

- [[Database/quotations]]
- [[Database/quotation_links]]
- [[Database/item_references]]
- [[Database/item_values]]
- [[Database/reference_links]]

## Entrada

### Payload

```ts
quotation_id: Quotation['id']
```

## Saída

Em caso de sucesso:

```ts
success(QuotationFull)
```

O retorno contém a cotação completa, incluindo todos os itens e seus respectivos dados.
Cada item inclui seus `item_values`, entre eles o prazo de entrega opcional (`delivery`), em dias.

Em caso de erro:

```ts
failure(message)
```

## Regras utilizadas

- `getFull`
    

## Fluxo

1. Verificar se a cotação existe.
2. Aplicar a regra [getFull](ServicesAndRules/rules/quotation/getFull)
3. Buscar todos os dados relacionados à cotação.
4. Retornar a cotação completa.

## Garantias

Quando o serviço retorna sucesso:

- a cotação existe;
    
- todos os dados da cotação foram carregados;
    
- todos os itens pertencentes à cotação fazem parte do retorno;
    
- todas as configurações (`item_values`) e links de referência (`reference_links`) associados aos itens fazem parte do retorno.
    

## Erros conhecidos

| Código                      | Quando ocorre                                                 |
| --------------------------- | ------------------------------------------------------------- |
| `QUOTATION_ID_NOT_INFORMED` | O identificador da cotação não foi informado.                 |
| `QUOTATION_NOT_FOUND`       | A cotação informada não existe.                               |
