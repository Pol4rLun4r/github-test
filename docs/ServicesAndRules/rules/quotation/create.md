# create

Valida e normaliza os dados necessários para criar uma cotação.

Esta regra garante que os dados mínimos de uma cotação estejam válidos antes de sua persistência.

## Objetivo

Preparar uma cotação para criação, aplicando validações e normalizações básicas.

A regra não cria registros no banco de dados. Sua responsabilidade é apenas validar e preparar os dados.

As regras da entidade podem ser consultadas em [quotation](Database/quotations).

## Entrada

### Payload

```ts
{
    notes?: string;
    amount: number;
    total_value: number;
    itemsCount: number;
}
```

O campo `itemsCount` representa a quantidade de itens enviados no payload (`items.length`). O service é responsável por informá-lo à regra.

O campo `status` não faz parte da entrada. A regra sempre define o status como rascunho.

## Saída

Em caso de sucesso:

```ts
success(Quotation)
```

Em caso de erro:

```ts
failure(ErrorCode)
```

## Validações

A regra executa as seguintes validações:

1. A quantidade de itens (`amount`) deve ser informada.
    
2. O valor total (`total_value`) deve ser informado.

3. O `amount` informado deve ser igual ao `itemsCount` (número de itens enviados no payload).

A primeira validação que falhar interrompe a execução da regra.

## Normalizações

Antes de retornar sucesso, a regra realiza as seguintes normalizações:

### notes

- Remove espaços em branco do início e do fim do texto.
    
- Caso o resultado seja uma string vazia, o campo é removido (`undefined`).
    

---

### status

- Sempre assume o valor `0` (`Rascunho`), independentemente de qualquer valor externo.

## Garantias

Quando a regra retorna sucesso:

- a cotação possui uma quantidade de itens válida;
    
- a cotação possui um valor total informado;

- o `amount` corresponde ao número de itens enviados no payload;
    
- o campo `status` é sempre `0` (Rascunho);
    
- o campo `notes`, quando existente, não contém espaços em branco desnecessários;
    
- o campo `notes` nunca contém uma string vazia.
    

## Códigos de erro

| Código                     | Descrição                                                              |
| -------------------------- | ---------------------------------------------------------------------- |
| `AMOUNT_NOT_INFORMED`      | A quantidade de itens da cotação não foi informada.                    |
| `TOTAL_VALUE_NOT_INFORMED` | O valor total da cotação não foi informado.                            |
| `AMOUNT_MISMATCH`          | O `amount` informado não corresponde ao número de itens enviados.      |
