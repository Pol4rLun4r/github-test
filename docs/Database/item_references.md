# item_references

Representa um cadastro reutilizável de um item.

Seu objetivo é armazenar as informações permanentes de um produto para que possam ser reutilizadas em diferentes cotações, evitando o preenchimento repetitivo dos mesmos dados.

## Responsabilidades

A tabela é responsável por:

* armazenar as informações permanentes de um item;
* servir como base para criação de itens em cotações;
* evitar duplicação de dados entre diferentes orçamentos;
* centralizar alterações em informações reutilizáveis do item.

## Campos importantes

* `id`

  * Identificador único do item.
  * Tipo: Inteiro.
  * Obrigatório.
  * Auto incrementado.

* `description`

  * Descrição do item.
  * Tipo: Texto.
  * Obrigatório.

* `internal_code`

  * Código interno utilizado pela empresa.
  * Tipo: Texto.
  * Opcional.

* `manufacturer_code`

  * Código informado pelo fabricante.
  * Tipo: Texto.
  * Opcional.

* `ncm`

  * Código fiscal (NCM) do produto.
  * Tipo: Texto.
  * Opcional.

* `notes`

  * Observações sobre o item.
  * Tipo: Texto.
  * Opcional.

## Regras de negócio

* Todo item deve possuir uma descrição.
* Um cadastro de item pode ser reutilizado em diversas cotações.
* As informações cadastradas representam apenas dados permanentes do item, não dados específicos de uma cotação.
* Um cadastro não pode ser removido enquanto estiver sendo utilizado por alguma cotação.

## Relações

* Um item de referência pode ser utilizado por vários itens de cotação.

## Notas sobre os campos

### description

É o principal identificador visual do item.

Deve ser suficientemente descritiva para permitir que o usuário encontre o item em pesquisas e o reutilize em novos orçamentos.

---

### internal_code

Representa um código interno utilizado pela empresa.

Seu preenchimento é opcional e serve como identificação interna do item.

---

### manufacturer_code

Representa o código informado pelo fabricante.

Seu preenchimento é opcional e serve como informação complementar para identificação do produto.

---

### ncm

Código fiscal utilizado para identificação tributária do produto.

É armazenado apenas como informação de referência.

---

### notes

Permite registrar informações adicionais sobre o item.

Seu preenchimento é opcional e não influencia nas regras de negócio.

## Invariantes

* `description` não pode ser vazia.
* Todo cadastro deve possuir um identificador único.
* Um cadastro utilizado em alguma cotação não pode ser removido.
