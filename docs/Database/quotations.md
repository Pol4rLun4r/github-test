# quotations

Representa uma cotação criada pelo usuário.

A cotação agrupa os itens orçados, seu valor total, observações e o estado atual (rascunho ou enviada).

## Responsabilidades

A tabela é responsável por:

* armazenar os dados principais da cotação;
* representar o ciclo de vida da cotação;
* agrupar os itens pertencentes à cotação;
* servir como entidade principal do processo de orçamento.

## Campos importantes

* `id`

  * Identificador único da cotação.
  * Tipo: Inteiro.
  * Obrigatório.
  * Auto incrementado.

* `status`

  * Estado atual da cotação.
  * Tipo: Inteiro.
  * Obrigatório.
  * Default: `0`.
  * Valores:

    * `0`: Rascunho.
    * `1`: Enviada.

* `notes`

  * Observações da cotação.
  * Tipo: Texto.
  * Opcional.

* `total_value`

  * Valor total da cotação.
  * Tipo: Número real.
  * Opcional.

* `amount`

  * Quantidade de itens da cotação.
  * Tipo: Inteiro.
  * Obrigatório.

## Regras de negócio

* Toda cotação inicia como rascunho.
* Toda cotação deve possuir pelo menos um item.
* O valor total é informado pelo frontend e persistido pelo backend.
* A quantidade de itens deve refletir exatamente o número de itens vinculados à cotação.

## Relações

* Uma cotação possui vários itens.

## Notas sobre os campos

### amount

Deve ser maior que zero.

Uma cotação sem itens não possui utilidade dentro do sistema.

Esse campo deve sempre representar a quantidade real de itens relacionados à cotação.

Na criação, o valor é calculado no frontend e enviado no payload. O backend valida se corresponde ao número de itens informados.

---

### total_value

Representa o valor total da cotação.

Na criação, o valor é calculado no frontend e enviado no payload. O backend valida sua presença e persiste o valor recebido.

---

### status

Na criação, o status é sempre definido pelo backend como rascunho (`0`). Não faz parte da entrada do usuário.

## Invariantes

* `amount` deve ser maior ou igual a `1`.
* `status` deve possuir um valor válido.
* Toda cotação deve possuir um identificador único.
