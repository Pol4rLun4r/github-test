# Services

Definições e explicações de como deve funcionar os services, regras, dados esperados dados enviados e afins.

## Como services deve funcionar

A principio, services dentro do electron deve ser apenas um orquestrador, chamando funções em ordem e organizando o resultado para ser enviado.

### Regras dentro do service e  onde devem ficar

Todas as regras dentro de `service`, devem ser tratadas em um arquivo separado, no caso `rules`, leia [Exemplo de rules](rules-example.md), para entender mais como organizar.
### Entrada padrão do `service`

Como cada service trata os dados de forma diferente, a entrada padrão será definida dentro do próprio `service` especifico, onde será normalmente algum `type`.

### Saída padrão do `service`

```ts
success(data)
failure(message)
```

- `success`: pega qualquer dado tratado por `rules` ou consultas finais no bando de dados.
- `failure`: trata qualquer erro esperado, ou erros lançados pelo `try catch` dentro de `service`

## Como o código do `service`
Exemplo de como escrever o [service](services-example.md)

## Definição de cada `service`

### quotation
services que envolve as cotações.

- [createQuotation](createQuotation.md) -> `service` para `criar` uma nova cotação
- [getAllQuotationSummary](getAllQuotationSummary.md) -> `service` para `pegar` todas as cotações, sem os dados dos itens
- [getQuotationFull](getQuotationFull.md) -> `service` para `pegar` uma cotação completa com base no `id`
- [updateQuotation](updateQuotation.md) -> `service` para `editar/atualizar` uma cotação completa (a cotação base e os itens)
### item
services que envolve os itens

- [searchDescription](ServicesAndRules/services/item/searchDescription.md) -> `service` para `buscar` um item pela descrição
- [findItemReferences](ServicesAndRules/services/item/findItemReferences.md) -> `service` para `buscar` todos os `item_references` com base no filtro de pesquisa
- [getReferenceLinks](ServicesAndRules/services/item/getReferenceLinks) -> `service` para `pegar` todos os `reference_links` de um `item_references`
- [getAllItemValuesByReferenceId](ServicesAndRules/services/item/getAllItemValuesByReferenceId) -> `service` para `pegar` todos os `item_values` de um `item_references`
- [getItemValuesById](ServicesAndRules/services/item/getItemValuesById.md) -> `service` para pegar um registro `item_values` pelo identificador
- [getItemDetailsByReferenceId](ServicesAndRules/services/item/getItemDetailsByReferenceId.md) -> `service` para pegar os dados da referência, os links, a quantidade de registros de valores e o registro mais recente