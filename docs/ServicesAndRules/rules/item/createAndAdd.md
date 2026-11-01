# createAndAdd

Valida e normaliza um ou mais itens antes de adicioná-los a uma cotação.

Esta regra garante que todos os itens estejam consistentes e prontos para persistência, além de realizar pequenas normalizações dos dados recebidos.

## Objetivo

Garantir que os itens informados possam ser adicionados com segurança a uma cotação.

A regra não cria registros no banco de dados. Sua responsabilidade é apenas validar e preparar os dados.

## Entrada

### Payload

```ts
{
    quotationExists: boolean;
    items: ItemData[];
}
```

## Saída

Em caso de sucesso:

```ts
success({
    items: ItemData[]
})
```

Os itens retornados já estarão normalizados.

Em caso de erro:

```ts
failure(ErrorCode)
```

## Validações

A regra executa as seguintes validações:

1. A cotação deve existir.
    
2. Deve existir ao menos um item.
    
3. Todo item deve possuir uma posição (`position`).
    
4. Não podem existir dois itens com a mesma posição.
    
5. Todo item deve possuir uma descrição.
    

A primeira validação que falhar interrompe a execução da regra.

## Normalização dos dados

Antes de retornar sucesso, a regra realiza as seguintes normalizações:

### item_reference.description

- Remove espaços em branco do início e fim.
    

---

### item_reference.notes

- Remove espaços em branco.
    
- Caso fique vazia, o campo é removido (`undefined`).
    

---

### item_values.quantity

- Caso não seja informada, assume o valor `1`.
    

---

### reference_links

- Remove espaços em branco de todos os links.
    
- Remove links vazios.
    
- Sempre retorna um array, mesmo quando nenhum link for informado.
    

## Garantias

Quando a regra retorna sucesso:

- a cotação existe;
    
- existe ao menos um item;
    
- todos os itens possuem descrição válida;
    
- todos os itens possuem uma posição;
    
- não existem posições duplicadas;
    
- todos os textos foram normalizados;
    
- a quantidade de todos os itens possui um valor válido;
    
- todos os links vazios foram removidos.
    

## Códigos de erro

|Código|Descrição|
|---|---|
|`QUOTATION_NOT_EXISTS`|A cotação informada não existe.|
|`NO_ITEMS`|Nenhum item foi informado.|
|`POSITION_NOT_INFORMED`|Um ou mais itens não possuem posição.|
|`SAME_POSITION`|Existem dois ou mais itens utilizando a mesma posição.|
|`DESCRIPTION_NOT_INFORMED`|Um ou mais itens não possuem descrição.|