# quotation_links

Representa a associação entre uma cotação, um item de referência e sua configuração de valores.

Cada registro indica que um determinado item faz parte de uma cotação utilizando um conjunto específico de valores.

## Responsabilidades

A tabela é responsável por:

* associar itens a uma cotação;
* conectar um `item_reference` à sua configuração (`item_values`);
* representar a composição de uma cotação através de seus itens.

## Campos importantes

* `id`

  * Identificador único da associação.
  * Tipo: Inteiro.
  * Obrigatório.
  * Auto incrementado.

* `quotation_id`

  * Cotação à qual o item pertence.
  * Tipo: Inteiro.
  * Obrigatório.

* `item_reference_id`

  * Item de referência utilizado na cotação.
  * Tipo: Inteiro.
  * Obrigatório.

* `item_values_id`

  * Configuração de valores utilizada pelo item.
  * Tipo: Inteiro.
  * Obrigatório.

## Regras de negócio

* Todo registro deve estar associado a uma cotação.
* Todo registro deve referenciar um `item_reference`.
* Todo registro deve referenciar um `item_values`.
* A associação representa um item pertencente a uma cotação.
* O registro não pode existir sem que todas as suas referências sejam válidas.

## Relações

* Cada `quotation_link` pertence a uma `quotation`.
* Cada `quotation_link` referencia um `item_reference`.
* Cada `quotation_link` referencia um `item_values`.
* Uma `quotation` pode possuir vários `quotation_links`.

## Notas sobre os campos

### quotation_id

Identifica a cotação à qual a associação pertence.

---

### item_reference_id

Define qual item de referência está sendo utilizado na cotação.

---

### item_values_id

Define qual configuração de valores será utilizada para esse item dentro da cotação.

A configuração determina os dados variáveis, como preço, quantidade, impostos e demais informações utilizadas na composição do item.

## Invariantes

* Todo registro deve possuir um identificador único.
* Todo `quotation_link` deve estar associado a uma `quotation`.
* Todo `quotation_link` deve possuir um `item_reference`.
* Todo `quotation_link` deve possuir um `item_values`.
