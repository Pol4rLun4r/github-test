# createQuotation

Cria uma nova cotação.

Este serviço é responsável por validar os dados recebidos, aplicar as regras de negócio e persistir uma nova cotação no sistema.

## Objetivo

Criar uma cotação em estado de rascunho contendo pelo menos um item válido.

As regras relacionadas à entidade podem ser encontradas em [Database/quotations](Database/quotations).
## Dependências

O serviço utiliza:

- `quotations`
- `quotation_links`
- `item_references`
- `item_values`

## Entrada

### Payload

```ts
payload: CreateQuotation
```

O payload deve conter todas as informações necessárias para criação da cotação.

A cotação (`quotation`) aceita apenas `notes`, `amount` e `total_value`. O campo `status` não faz parte da entrada — é sempre definido pelo backend como rascunho.

## Saída

Em caso de sucesso:

```ts
success(QuotationLink[])
```

Em caso de erro:

```ts
failure(ErrorCode)
```

## Regras de negócio

Além das regras definidas em [Database/quotations](Database/quotations), este serviço deve garantir que:

- toda cotação seja criada como rascunho;
- exista pelo menos um item válido;
- cada item possua um `item_reference`;
- cada item possua um `item_values`;
- o valor total (`total_value`) seja informado pelo frontend;
- a quantidade de itens (`amount`) informada corresponda exatamente ao número de itens enviados no payload.

## Fluxo

1. Validar dados da cotação (não os dados dos itens) em [create](ServicesAndRules/rules/quotation/create).
2. Criar "casca" da cotação.
3. Validar todos os itens em [createAndAdd](ServicesAndRules/rules/item/createAndAdd) .
4. Criar e adicionar itens a cotação.
5. Retornar "quotation_links"
## Observações

Este serviço nunca deve receber o campo `status` informado pelo usuário.

O estado inicial da cotação é sempre `Rascunho`.

O `total_value` é calculado no frontend e enviado junto ao payload. O backend valida sua presença, mas não recalcula o valor.

O `amount` também é calculado no frontend (quantidade de itens na lista) e enviado junto ao payload. O backend valida se corresponde ao número de itens informados.

## Garantias

Após executar este serviço com sucesso:

- a cotação existe no banco;
- o status é Rascunho;
- existe ao menos um item associado;
- o valor total informado foi persistido;
- a quantidade de itens corresponde aos itens associados.