# getAllQuotationSummary

Obtém um resumo de todas as cotações cadastradas.

Este serviço retorna apenas os dados principais de cada cotação. Os itens pertencentes à cotação não são carregados.

## Objetivo

Permitir a listagem de cotações de forma rápida e eficiente.

Este serviço deve ser utilizado sempre que apenas informações resumidas da cotação forem necessárias, como listagens, pesquisas ou tabelas.

## Dependências

O serviço utiliza:

- `quotations`

## Entrada

Este serviço não recebe parâmetros.

## Saída

Em caso de sucesso:

```ts
success(Quotation[])
```

Cada objeto retornado representa um resumo de uma cotação.

Os itens associados à cotação não fazem parte do retorno.

Em caso de erro:

```ts
failure(message)
```

## Fluxo

1. Buscar todas as cotações.
    
2. Retornar apenas os dados resumidos de cada cotação.

## Garantias

Quando o serviço retorna sucesso:

- todas as cotações disponíveis foram consultadas;
    
- nenhum item pertencente às cotações é carregado;
    
- todos os registros retornados representam apenas informações resumidas.
