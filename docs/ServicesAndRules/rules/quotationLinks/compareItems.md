# compareItems

Compara os itens enviados no payload de atualização com os itens atualmente vinculados à cotação.

Esta regra identifica quais itens são novos, quais correspondem a vínculos existentes e quais foram removidos, além de validar os `quotation_link_id` informados.

## Objetivo

Preparar os itens de uma cotação para atualização, classificando-os em:

- itens novos, que ainda não possuem vínculo com a cotação;
    
- itens existentes, que correspondem a vínculos atuais da cotação;
    
- vínculos que não foram enviados no payload e, portanto, devem ser removidos.
    

A regra também garante que os `quotation_link_id` informados sejam válidos, únicos e pertençam à cotação atual.

A regra não altera registros no banco de dados. Sua responsabilidade é apenas validar e comparar os dados recebidos.

## Entrada

### Payload

```
{
    currentQuotationLinkIds: number[];
    items: UpdateQuotation["items"];
}
```

O campo `currentQuotationLinkIds` representa os IDs dos vínculos atualmente associados à cotação.

O campo `items` representa os itens enviados no payload de atualização.

Cada item pode possuir ou não um `quotation_link_id`.

Quando o `quotation_link_id` não é informado, o item é considerado novo.

## Saída

Em caso de sucesso:

```
success({
    added: QuotationItemPayload[];
    removed: number[];
    matched: MatchedQuotationItem[];
})
```

Em caso de erro:

```
failure(ErrorCode)
```

### added

Contém os itens que não possuem `quotation_link_id` e, portanto, devem ser adicionados à cotação.

### removed

Contém os `quotation_link_id` existentes atualmente na cotação, mas que não foram enviados no payload.

### matched

Contém os itens que possuem um `quotation_link_id` válido e correspondente a um vínculo existente na cotação.

Os itens desta lista possuem a seguinte estrutura:

```
type MatchedQuotationItem = QuotationItemPayload & {
    quotation_link_id: number;
}
```

## Validações

A regra executa as seguintes validações:

1. Quando informado, o `quotation_link_id` deve ser um número inteiro positivo e seguro.
    
2. Um mesmo `quotation_link_id` não pode ser enviado mais de uma vez no payload.
    
3. O `quotation_link_id` informado deve pertencer à cotação atual.
    

A primeira validação que falhar interrompe a execução da regra.

## Classificação dos itens

### Itens novos

Quando o item não possui `quotation_link_id`, ele é adicionado à lista `added`.

```
{
    added: [item]
}
```

O item não é submetido às validações de vínculo, pois ainda não possui um vínculo existente.

### Itens correspondentes

Quando o item possui um `quotation_link_id` válido e pertencente à cotação atual, ele é adicionado à lista `matched`.

Esses itens representam linhas existentes que devem permanecer na cotação.

### Itens removidos

Após processar todos os itens recebidos, a regra compara os IDs atuais da cotação com os IDs recebidos no payload.

Todo `quotation_link_id` atual que não estiver presente no payload é adicionado à lista `removed`.

Isso significa que a ausência de um vínculo existente no payload representa a remoção daquele item da cotação.

## Garantias

Quando a regra retorna sucesso:

- todos os `quotation_link_id` informados são números inteiros positivos e seguros;
    
- nenhum `quotation_link_id` é enviado mais de uma vez;
    
- todos os `quotation_link_id` existentes no payload pertencem à cotação atual;
    
- `added` contém somente itens sem vínculo;
    
- `matched` contém somente itens vinculados a registros existentes da cotação;
    
- `removed` contém somente vínculos atuais que não foram enviados no payload;
    
- nenhum registro é alterado pela regra.
    

## Códigos de erro

|Código|Descrição|
|---|---|
|`INVALID_QUOTATION_LINK_ID`|O ID do vínculo da cotação informado não é um número inteiro positivo e seguro.|
|`DUPLICATE_QUOTATION_LINK_ID`|O mesmo vínculo da cotação foi enviado mais de uma vez no payload.|
|`QUOTATION_LINK_NOT_FOUND`|O vínculo informado não pertence à cotação atual.|