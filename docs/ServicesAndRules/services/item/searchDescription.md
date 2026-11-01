# searchDescription

Pesquisa itens de referência pela descrição.

Este serviço retorna todos os itens cuja descrição corresponda ao termo informado.

## Objetivo

Permitir a localização de itens de referência utilizando parte ou toda a descrição cadastrada.

Este serviço deve ser utilizado em funcionalidades de pesquisa, seleção ou reutilização de itens.

## Dependências

O serviço utiliza:

- [[item_references]]
    

## Entrada

### Payload

```ts
SearchItemDescription
```

Representa o texto utilizado para realizar a pesquisa.

## Saída

Em caso de sucesso:

```ts
success(ItemReference[])
```

O retorno contém todos os itens cuja descrição corresponda ao termo pesquisado.

Em caso de erro:

```ts
failure(message)
```

## Regras utilizadas

- `searchDescription`
    

## Fluxo

1. Receber o termo de pesquisa.
    
2. Aplicar a regra [searchDescription](ServicesAndRules/rules/item/searchDescription).
    
3. Consultar os itens utilizando a descrição normalizada.
    
4. Retornar os itens encontrados.
    

## Garantias

Quando o serviço retorna sucesso:

- o termo de pesquisa foi validado;
    
- o termo de pesquisa foi normalizado;
    
- a pesquisa foi realizada utilizando a descrição normalizada;
    
- todos os itens retornados possuem descrição compatível com o termo informado.
    

## Erros conhecidos

| Código                     | Quando ocorre                                    |
| -------------------------- | ------------------------------------------------ |
| `DESCRIPTION_NOT_STRING`   | O termo informado não é uma string.              |
| `DESCRIPTION_NOT_INFORMED` | Nenhuma descrição foi informada para a pesquisa. |