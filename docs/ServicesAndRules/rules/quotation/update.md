# update

Valida e normaliza os dados necessários para atualizar uma cotação existente.

Esta regra garante que a cotação esteja identificada, exista e que os dados obrigatórios para atualização estejam válidos antes de sua persistência.

## Objetivo

Preparar os dados de uma cotação para atualização, aplicando validações e normalizações básicas.

A regra não atualiza registros no banco de dados. Sua responsabilidade é apenas validar e preparar os dados.

As regras da entidade podem ser consultadas em [quotation](Database/quotations).

## Entrada

### Payload

```ts
{
    id: number;
    notes?: string;
    status: number;
    amount: number;
    total_value: number;
    itemsCount: number;
    quotationExists: boolean;
}
```

O campo `itemsCount` representa a quantidade de itens enviados no payload (`items.length`). O service é responsável por informá-lo à regra.

O campo `quotationExists` indica se a cotação identificada pelo `id` existe no banco de dados. O service é responsável por realizar essa verificação e informar o resultado à regra.

## Saída

Em caso de sucesso:

```ts
success(UpdateQuotationData)
```

Em caso de erro:

```ts
failure(ErrorCode)
```

## Validações

A regra executa as seguintes validações:

1. O `id` da cotação deve ser informado.

2. A cotação identificada pelo `id` deve existir.

3. A quantidade de itens (`amount`) deve ser informada.

4. O valor total (`total_value`) deve ser informado.

5. O `amount` informado deve ser igual ao `itemsCount` (número de itens enviados no payload).

A primeira validação que falhar interrompe a execução da regra.

## Normalizações

Antes de retornar sucesso, a regra realiza as seguintes normalizações:

### notes

* Remove espaços em branco do início e do fim do texto.

* Caso o resultado seja uma string vazia, o campo é definido como `undefined`.

---

### status

* Caso não seja informado, assume o valor `0`.

* O valor informado é mantido quando existente.

## Garantias

Quando a regra retorna sucesso:

* a cotação possui um `id` informado;

* a cotação identificada pelo `id` existe;

* a quantidade de itens foi informada;

* o valor total foi informado;

* o `amount` corresponde ao número de itens enviados no payload;

* o campo `notes`, quando existente, não contém espaços em branco desnecessários;

* o campo `notes` nunca contém uma string vazia;

* o campo `status` possui um valor definido, assumindo `0` quando não informado.

## Códigos de erro

| Código                      | Descrição                                                         |
| --------------------------- | ----------------------------------------------------------------- |
| `QUOTATION_ID_NOT_INFORMED` | O ID da cotação não foi informado.                                |
| `QUOTATION_NOT_FOUND`       | A cotação com o ID informado não foi encontrada.                  |
| `AMOUNT_NOT_INFORMED`       | A quantidade de itens da cotação não foi informada.               |
| `TOTAL_VALUE_NOT_INFORMED`  | O valor total da cotação não foi informado.                       |
| `AMOUNT_MISMATCH`           | O `amount` informado não corresponde ao número de itens enviados. |
