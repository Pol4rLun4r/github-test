# findItemReferences

Obtém os itens de referência cadastrados.

Este serviço retorna todos os itens cadastrados ou apenas os itens que correspondam ao termo de pesquisa informado.

## Objetivo

Centralizar a consulta dos itens de referência.

Quando um termo de pesquisa é informado, o resultado é filtrado pela descrição. Caso contrário, todos os itens são retornados.

## Dependências

O serviço utiliza:

- [[item_references]]
    

## Entrada

### Payload

```ts
SearchItemDescriptionIsOptional
```

O termo de pesquisa é opcional.

## Saída

Em caso de sucesso:

```ts
success(ItemReference[])
```

O retorno contém todos os itens encontrados conforme o critério de pesquisa.

Em caso de erro:

```ts
failure(message)
```

## Regras utilizadas

- `findItemReferences`
    

## Fluxo

1. Receber o termo de pesquisa.
    
2. Aplicar a regra [findItemReferences](ServicesAndRules/rules/item/findItemReferences) .
    
3. Caso a regra retorne o código `GET_ALL`, obter todos os itens cadastrados.
    
4. Caso contrário, pesquisar apenas os itens cuja descrição corresponda ao termo informado.
    
5. Retornar os itens encontrados.
    

## Garantias

Quando o serviço retorna sucesso:

- sempre retorna uma coleção de itens de referência;
    
- quando nenhum filtro é informado, todos os itens cadastrados são retornados;
    
- quando um filtro é informado, apenas os itens compatíveis com a pesquisa são retornados;
    
- o termo de pesquisa é normalizado antes da consulta.
