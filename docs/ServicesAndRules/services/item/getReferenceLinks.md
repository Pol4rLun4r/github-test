# getReferenceLinks

Obtém todos os links de referência associados a um item.

Este serviço retorna todos os registros de `reference_links` pertencentes a um determinado `item_reference`.

## Objetivo

Consultar os links de referência de um item.

Este serviço deve ser utilizado sempre que for necessário exibir ou utilizar os recursos externos associados a um item de referência.

## Dependências

O serviço utiliza:

- [[item_references]]
    
- [[reference_links]]
    

## Entrada

### Payload

```ts
item_reference_id: GetReferenceLinks
```

Representa o identificador do item de referência.

## Saída

Em caso de sucesso:

```ts
success(ReferenceLink[])
```

O retorno contém todos os links associados ao item de referência.

Caso o item não possua links cadastrados, o retorno será uma coleção vazia.

Em caso de erro:

```ts
failure(message)
```

## Regras utilizadas

- `getReferenceLinks`
    

## Fluxo

1. Verificar se o item de referência existe.
    
2. Aplicar a regra [getReferenceLinks](ServicesAndRules/rules/item/getReferencesLinks) .
    
3. Consultar todos os links associados ao item de referência.
    
4. Retornar os links encontrados.
    

## Garantias

Quando o serviço retorna sucesso:

- o item de referência existe;
    
- todos os links pertencentes ao item de referência são retornados;
    
- caso não existam links cadastrados, uma coleção vazia é retornada.
    

## Erros conhecidos

|Código|Quando ocorre|
|---|---|
|`ITEM_REFERENCE_ID_NOT_INFORMED`|O identificador do item de referência não foi informado.|
|`ITEM_REFERENCE_NOT_FOUND`|O item de referência informado não existe.|