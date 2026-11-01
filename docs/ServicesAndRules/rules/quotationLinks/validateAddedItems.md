# validateAddedItems

Valida e prepara os itens que serão adicionados a uma cotação.

Esta regra garante que os itens adicionados possuam posições válidas e únicas, referências de item válidas e os dados mínimos necessários para criação. Também normaliza os campos textuais antes de retornar os itens preparados.

## Objetivo

Validar os itens adicionados à cotação e prepará-los para persistência.

A regra também verifica os itens já existentes na cotação para garantir que não existam posições duplicadas entre todos os itens.

A regra não persiste dados no banco de dados.

## Entrada

### Payload

```
{
    addedItems: QuotationItemPayload[];
    allItems: QuotationItemPayload[];
    existingItemReferences: ItemReference[];
}
```

O campo `addedItems` contém apenas os itens que serão adicionados à cotação.

O campo `allItems` contém todos os itens da cotação, incluindo os que já existiam e os novos itens. Ele é utilizado para validar a posição e garantir que não existam posições duplicadas.

O campo `existingItemReferences` contém as referências de itens existentes disponíveis para validação.

## Saída

Em caso de sucesso:

```
success({
    items: QuotationItemToAdd[];
})
```

Em caso de erro:

```
failure(ErrorCode)
```

## Validações

A regra executa as seguintes validações:

1. Todos os itens de `allItems` devem possuir uma posição informada.
    
2. A posição deve ser um número inteiro seguro e não negativo.
    
3. Não pode existir mais de um item com a mesma posição.
    
4. Quando um item possui `item_reference.id`, o ID deve ser um número inteiro seguro e maior que zero.
    
5. Quando um `item_reference.id` é informado, a referência deve existir em `existingItemReferences`.
    
6. Quando um novo `item_reference` é criado sem ID, sua descrição deve ser informada.
    
7. Cada item adicionado deve possuir uma posição.
    

A primeira validação que falhar interrompe a execução da regra.

## Normalizações

Antes de retornar sucesso, a regra realiza as seguintes normalizações.

### item_reference.description

- Remove espaços em branco do início e do fim.
- Para novos itens, não pode resultar em uma string vazia.

### Campos opcionais de `item_reference`

Os campos abaixo têm seus espaços em branco removidos:

- `internal_code`
- `manufacturer_code`
- `ncm`
- `notes`

Caso o resultado seja uma string vazia, o campo é definido como `undefined`.

### reference_links

Os links de referência são normalizados da seguinte forma:

- Remove espaços em branco do início e do fim do `content`.
- Remove links cujo `content` resulte em uma string vazia.

### item_values.quantity

Caso `quantity` não seja informado, o valor padrão utilizado é `1`.

## Referências de item

Quando `item_reference.id` é informado:

- o ID é validado;
- a referência é buscada entre as referências existentes;
- a referência existente é utilizada no item.

Quando `item_reference.id` não é informado:

- uma nova referência é criada;
- a `description` é obrigatória;
- os campos opcionais são normalizados.

## Saída preparada

Cada item retornado contém:

```
{
    item_reference: ItemReference;
    item_values: {
        position: number;
        quantity: number;
        unit_price: ...;
        markup: ...;
        purchase_shipping: ...;
        ipi: ...;
        st: ...;
        extra_value: ...;
        boarding: ...;
    };
    reference_links: {
        content: string;
    }[];
}
```

A saída contém somente os itens presentes em `addedItems`. Itens que já existiam na cotação não são incluídos novamente.

## Garantias

Quando a regra retorna sucesso:

- todos os itens da cotação possuem posições válidas;
- nenhuma posição está duplicada;
- cada posição é um número inteiro seguro e não negativo;
- referências existentes utilizadas pelos novos itens são válidas;
- novas referências possuem uma descrição válida;
- campos textuais opcionais não possuem espaços desnecessários;
- `quantity` possui o valor `1` quando não informado;
- `reference_links` não contém conteúdos vazios;
- os itens retornados estão preparados para serem adicionados à cotação;
- somente os novos itens são retornados.

## Códigos de erro

|Código|Descrição|
|---|---|
|`POSITION_NOT_INFORMED`|Um item não possui uma posição válida.|
|`SAME_POSITION`|Mais de um item possui a mesma posição.|
|`INVALID_ITEM_REFERENCE_ID`|O ID da referência do item não é um número inteiro positivo válido.|
|`ITEM_REFERENCE_NOT_FOUND`|A referência do item informada não foi encontrada entre as referências existentes.|
|`DESCRIPTION_NOT_INFORMED`|Um novo item não possui uma descrição informada.|