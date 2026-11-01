// utils
import { failure, success } from "../../utils/handleSuccess.js";
import validateItemReferenceFields, { rulesCode as itemReferenceRulesCode } from "../item/validateItemReference.js";
import validateItemValues from "../item/validateItemValues.js";

type QuotationItemPayload = UpdateQuotation["items"][number];

export interface ValidateAddedQuotationItemsInput {
    addedItems: QuotationItemPayload[];
    allItems: QuotationItemPayload[];
    existingItemReferences: ItemReference[];
}

export const rulesCode = {
    POSITION_NOT_INFORMED: "Cada item deve ter uma posição/ordem",
    SAME_POSITION: "Não é permitido ter mais de um item com a mesma posição/ordem",
    INVALID_ITEM_REFERENCE_ID: "O ID da referência do item é inválido.",
    ITEM_REFERENCE_NOT_FOUND: (id: number) => `A referência do item ${id} não foi encontrada.`,
    DESCRIPTION_NOT_INFORMED: "Cada item novo deve ter uma descrição",
    ADDED_ITEM_NOT_IN_ALL_ITEMS: "Um item adicionado não foi encontrado na cotação enviada.",
};

const validateAddedItems = ({
    addedItems,
    allItems,
    existingItemReferences,
}: ValidateAddedQuotationItemsInput) => {
    const positions = new Set<number>();
    const itemValuesByItem = new Map<QuotationItemPayload, ItemValues>();

    // validar se cada item possui uma posição e se não há posições duplicadas
    for (const item of allItems) {
        const validateValues = validateItemValues({ itemValues: item.item_values });

        // se a validação dos valores do item falhar, retorna o erro correspondente
        if (!validateValues.success) {
            return validateValues;
        }

        const itemValues = validateValues.data.itemValues;
        const position = itemValues.position;

        // validar se a posição já foi usada por outro item
        if (positions.has(position)) {
            return failure(rulesCode.SAME_POSITION);
        }

        positions.add(position); // adiciona a posição ao conjunto de posições usadas
        itemValuesByItem.set(item, itemValues as ItemValues);
    }

    // criar um mapa de item_reference existentes para validação rápida
    const referencesById = new Map(
        existingItemReferences
            .filter((reference): reference is ItemReference & { id: number } => reference.id !== undefined) // filtra apenas referências com ID definido
            .map((reference) => [reference.id, reference]), // transforma cada referência em um par [id, reference]. por exemplo: [42, objetoDaReferencia]
            // nota: "new Map(...)" cria uma coleção de pares em que o primeiro valor é a chave e o segundo é o valor. Assim, o ID vira a chave e a referência é o valor
    );

    const items: QuotationItemToAdd[] = [];

    // validar cada item adicionado
    for (const item of addedItems) {
        let itemReference: ItemReference;

        const validateReference = validateItemReferenceFields({ itemReference: item.item_reference });

        // se a validação da referência do item falhar, retorna o erro correspondente
        if (!validateReference.success) {
            if (validateReference.data === itemReferenceRulesCode.DESCRIPTION_NOT_INFORMED) {
                return failure(rulesCode.DESCRIPTION_NOT_INFORMED);
            }

            return validateReference; // retorna o erro de validação da referência do item, caso seja outro tipo de erro
        }

        // "if" para verificar se a referência do item é existente (com ID) ou nova (sem ID)
        if (validateReference.data.type === "existing") {
            const existingReference = referencesById.get(validateReference.data.id);

            // se a referência existente não for encontrada, retorna erro
            if (!existingReference) {
                return failure(rulesCode.ITEM_REFERENCE_NOT_FOUND(validateReference.data.id));
            }

            // atribui a referência existente ao itemReference
            itemReference = existingReference; 

        } else {
            // se a referência do item for nova, atribui os dados validados ao itemReference
            itemReference = validateReference.data.data;
        }

        const itemValues = itemValuesByItem.get(item);

        // se os valores do item não forem encontrados no mapa, significa que o item adicionado não está presente na lista de todos os itens enviados, então retorna erro
        if (!itemValues) {
            return failure(rulesCode.ADDED_ITEM_NOT_IN_ALL_ITEMS);
        }

        // criar um array de reference_links, filtrando apenas os links com conteúdo não vazio
        const referenceLinks = (item.reference_links ?? [])
            .map((link) => ({ content: (link.content ?? "").trim() }))
            .filter((link) => link.content.length > 0);

        items.push({
            item_reference: itemReference,
            item_values: {
                position: itemValues.position,
                quantity: itemValues.quantity,
                unit_price: itemValues.unit_price,
                markup: itemValues.markup,
                purchase_shipping: itemValues.purchase_shipping,
                ipi: itemValues.ipi,
                st: itemValues.st,
                extra_value: itemValues.extra_value,
                boarding: itemValues.boarding,
                delivery: itemValues.delivery,
            },
            reference_links: referenceLinks,
        });
    }

    // retorna sucesso com os itens validados e preparados para serem adicionados à cotação (apenas os itens que serão adicionados, sem os itens que já existiam na cotação)
    return success({ items });
};

export default validateAddedItems;