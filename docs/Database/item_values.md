# item_values

Representa os dados variáveis de um item de referência.

Seu objetivo é armazenar as informações que podem variar entre diferentes utilizações do mesmo item, como preço, quantidade, impostos e demais valores utilizados na composição de uma cotação.

Esses dados podem ser reutilizados como base para novos orçamentos quando desejado, mas sua principal responsabilidade é representar a configuração variável de um item.

## Conceito

O sistema divide as informações de um item em duas partes:

* `item_reference` contém os dados permanentes do item.
* `item_values` contém os dados variáveis, que podem ser alterados entre diferentes utilizações do mesmo item.

Essa separação evita alterações desnecessárias no cadastro principal e permite reutilizar tanto o item quanto suas configurações de precificação quando necessário.

## Responsabilidades

A tabela é responsável por:

* armazenar os dados variáveis de um item;
* separar informações permanentes das informações que mudam entre diferentes utilizações;
* servir como base para criação de itens em uma cotação;
* permitir a reutilização de configurações de precificação quando conveniente.

## Campos importantes

* `id`

  * Identificador único do conjunto de valores.
  * Tipo: Inteiro.
  * Obrigatório.
  * Auto incrementado.

* `item_reference_id`

  * Item de referência ao qual os dados pertencem.
  * Tipo: Inteiro.
  * Obrigatório.

* `position`

  * Posição de exibição do item na cotação.
  * Tipo: Inteiro.
  * Obrigatório.

* `quantity`

  * Quantidade do item.
  * Tipo: Inteiro.
  * Opcional.

* `unit_price`

  * Valor unitário do item.
  * Tipo: Número real.
  * Opcional.

* `markup`

  * Margem de lucro aplicada ao item.
  * Tipo: Texto.
  * Opcional.

* `purchase_shipping`

  * Valor do frete de compra.
  * Tipo: Número real.
  * Opcional.

* `ipi`

  * Valor ou percentual do IPI.
  * Tipo: Número real.
  * Opcional.

* `st`

  * Valor da Substituição Tributária.
  * Tipo: Número real.
  * Opcional.

* `boarding`

  * Prazo de embarque ou informação relacionada ao embarque.
  * Tipo: Inteiro.
  * Opcional.

* `delivery`

  * Prazo de entrega do item.
  * Tipo: Inteiro maior ou igual a zero.
  * Opcional.

* `extra_value`

  * Valor adicional aplicado ao item.
  * Tipo: Número real.
  * Opcional.

## Regras de negócio

* Todo conjunto de valores deve estar associado a um `item_reference`.
* Todo conjunto de valores deve possuir uma posição.
* Os dados armazenados representam a configuração variável de um item.
* Um conjunto de valores pode ser reutilizado como base para novos orçamentos.
* Um conjunto de valores não pode ser removido enquanto estiver sendo utilizado.

## Relações

* Cada `item_values` pertence a um `item_reference`.
* Um `item_reference` pode possuir vários `item_values`.

## Notas sobre os campos

### position

Define a posição do item dentro da cotação.

Embora faça parte do conjunto de dados reutilizáveis, normalmente não é reaproveitado ao utilizar um `item_values` como base para uma nova cotação, pois a ordenação depende do contexto da cotação atual.

---

### quantity

Representa a quantidade utilizada para aquele conjunto de valores.

Pode variar entre diferentes utilizações do mesmo item.

---

### unit_price

Representa o preço unitário do item.

Seu valor pode variar conforme cliente, fornecedor, negociação ou qualquer outro fator comercial.

---

### markup

Representa a margem de lucro aplicada ao item.

Seu preenchimento é opcional e pode variar conforme cada orçamento.

---

### boarding

Armazena o prazo de embarque em dias corridos, independente da forma que foi informado (dias corridos/dias úteis ou uma data completa).

Seu preenchimento é opcional e depende das informações disponíveis para cada orçamento.

---

### delivery

Armazena o prazo de entrega do item em dias. Seu preenchimento é opcional e depende das informações disponíveis para cada orçamento.

---

### extra_value

Representa um valor adicional aplicado ao item.

Pode ser utilizado para complementar o custo do item em situações específicas.

## Invariantes

* Todo registro deve possuir um identificador único.
* Todo `item_values` deve estar associado a um `item_reference`.
* `position` deve possuir um valor válido.
