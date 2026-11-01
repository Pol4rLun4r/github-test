# reference_links

Representa um link de referência associado a um item.

Seu objetivo é armazenar links úteis relacionados ao item, como páginas de fabricantes, datasheets, lojas, catálogos ou qualquer outro conteúdo que auxilie durante a elaboração de um orçamento.

## Responsabilidades

A tabela é responsável por:

* armazenar links relacionados a um item de referência;
* centralizar materiais de consulta do item;
* facilitar o acesso a informações externas durante a criação ou edição de uma cotação.

## Campos importantes

* `id`

  * Identificador único do link.
  * Tipo: Inteiro.
  * Obrigatório.
  * Auto incrementado.

* `item_reference_id`

  * Item de referência ao qual o link pertence.
  * Tipo: Inteiro.
  * Obrigatório.

* `content`

  * Endereço do recurso externo.
  * Tipo: Texto.
  * Obrigatório.

## Regras de negócio

* Todo link deve estar associado a um `item_reference`.
* O conteúdo deve ser uma URL válida utilizando os protocolos `http` ou `https`.
* Um item de referência pode possuir vários links.

## Relações

* Cada `reference_link` pertence a um `item_reference`.
* Um `item_reference` pode possuir vários `reference_links`.

## Notas sobre os campos

### content

Armazena o endereço de um recurso externo relacionado ao item.

Pode apontar para documentos técnicos, páginas de fabricantes, lojas, manuais, catálogos ou qualquer outra fonte útil para consulta.

O link deve utilizar os protocolos `http` ou `https`.

## Invariantes

* Todo registro deve possuir um identificador único.
* Todo `reference_link` deve estar associado a um `item_reference`.
* `content` deve conter uma URL válida utilizando `http` ou `https`.
