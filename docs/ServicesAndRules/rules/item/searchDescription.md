# searchDescription

Valida e normaliza o texto utilizado para pesquisar itens pela descrição.

Esta regra garante que o termo informado seja válido antes da realização da pesquisa.

## Objetivo

Preparar o texto de pesquisa utilizado para localizar itens por descrição.

A regra não realiza consultas ao banco de dados. Sua responsabilidade é apenas validar e normalizar o termo informado.

As regras da entidade podem ser consultadas em [[item_references]].

## Entrada

### Payload

```ts
SearchItemDescription
```

## Saída

Em caso de sucesso:

```ts
success(SearchItemDescription)
```

Em caso de erro:

```ts
failure(ErrorCode)
```

## Validações

A regra executa as seguintes validações:

1. O termo informado deve ser uma `string`.
    
2. O termo não pode ser vazio.
    

A primeira validação que falhar interrompe a execução da regra.

## Normalizações

Antes de retornar sucesso, a regra realiza as seguintes normalizações:

### Descrição

- Remove espaços em branco do início e do fim do texto.
    

## Garantias

Quando a regra retorna sucesso:

- o termo de pesquisa é uma `string`;
    
- o termo de pesquisa não é vazio;
    
- o texto não possui espaços em branco desnecessários no início ou no fim.
    

## Códigos de erro

| Código                     | Descrição                                        |
| -------------------------- | ------------------------------------------------ |
| `DESCRIPTION_NOT_STRING`   | O termo informado não é uma string.              |
| `DESCRIPTION_NOT_INFORMED` | Nenhuma descrição foi informada para a pesquisa. |