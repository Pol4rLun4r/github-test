// utils
import { failure, success } from "../../utils/handleSuccess.js";
import validateItemValues from "../item/validateItemValues.js";

type ItemValueChanges = Partial<Pick<ItemValues,
    "position" | "quantity" | "unit_price" | "markup" | "purchase_shipping" | "ipi" | "st" | "extra_value" | "boarding" | "delivery"
>>;

type MatchedItem = UpdateQuotation["items"][number] & {
    quotation_link_id: number;
};

type CurrentQuotationLink = Pick<QuotationLink, "id" | "item_values_id">;

type ItemValuesDecision = {
    quotation_link_id: number;
    item_values_id: number;
    changes: ItemValueChanges;
};

export interface CompareItemValuesInput {
    matchedItems: MatchedItem[];
    currentQuotationLinks: CurrentQuotationLink[];
    existingItemValues: ItemValues[];
}

export const rulesCode = {
    QUOTATION_LINK_NOT_FOUND: (id: number) => `O vínculo da cotação ${id} não foi encontrado entre os vínculos atuais.`,
    CURRENT_ITEM_VALUES_ID_INVALID: (id: number) => `O vínculo da cotação ${id} possui valores atuais inválidos.`,
    ITEM_VALUES_NOT_FOUND: (id: number) => `Os valores do item ${id} não foram encontrados.`,
    INVALID_ITEM_VALUES_ID: "O ID dos valores do item é inválido.",
    ITEM_VALUES_ID_MISMATCH: "Os valores enviados não correspondem à linha atual.",
};

const compareItemValues = ({
    matchedItems,
    currentQuotationLinks,
    existingItemValues,
}: CompareItemValuesInput) => {
    const linksById = new Map<number, CurrentQuotationLink>();

    // criar um mapa de vínculos (quotation_link) atuais para validação rápida
    for (const link of currentQuotationLinks) {
        if (typeof link.id === "number" && Number.isSafeInteger(link.id) && link.id > 0) {
            linksById.set(link.id, link);
        }
    }

    const itemValuesById = new Map<number, ItemValues>();

    // criar um mapa de valores de itens existentes para validação rápida
    for (const itemValues of existingItemValues) {
        if (typeof itemValues.id === "number" && Number.isSafeInteger(itemValues.id) && itemValues.id > 0) {
            itemValuesById.set(itemValues.id, itemValues);
        }
    }

    const decisions: ItemValuesDecision[] = [];

    for (const item of matchedItems) {
        const quotationLinkId = item.quotation_link_id;
        const currentLink = linksById.get(quotationLinkId);

        // verifica se o vínculo da cotação atual existe
        if (!currentLink) {
            return failure(rulesCode.QUOTATION_LINK_NOT_FOUND(quotationLinkId));
        }

        // verifica se o vínculo da cotação possui um ID de valores de item válido
        const currentItemValuesId = currentLink.item_values_id;
        if (!Number.isSafeInteger(currentItemValuesId) || currentItemValuesId <= 0) {
            return failure(rulesCode.CURRENT_ITEM_VALUES_ID_INVALID(quotationLinkId));
        }

        // verifica se os valores do item atual existem
        const current = itemValuesById.get(currentItemValuesId);
        if (!current) {
            return failure(rulesCode.ITEM_VALUES_NOT_FOUND(currentItemValuesId));
        }

        // valida os valores do item enviados
        const submitted = item.item_values;
        if (typeof submitted.id !== "number" || !Number.isSafeInteger(submitted.id) || submitted.id <= 0) {
            return failure(rulesCode.INVALID_ITEM_VALUES_ID);
        }

        /// verifica se o id dos valores do item enviados corresponde ao id dos valores do item atual
        if (current.id !== submitted.id) {
            return failure(rulesCode.ITEM_VALUES_ID_MISMATCH);
        }

        // valida os valores do item enviados e normaliza os valores
        const validation = validateItemValues({ itemValues: submitted });
        if (!validation.success) {
            return validation;
        }

        const normalizedSubmittedValues = validation.data.itemValues;
        const currentValues = {
            position: current.position,
            quantity: current.quantity ?? 1,
            unit_price: current.unit_price ?? undefined,
            markup: current.markup ?? undefined,
            purchase_shipping: current.purchase_shipping ?? undefined,
            ipi: current.ipi ?? undefined,
            st: current.st ?? undefined,
            extra_value: current.extra_value ?? undefined,
            boarding: current.boarding ?? undefined,
            delivery: current.delivery ?? undefined,
        };
        const changes: ItemValueChanges = {};

        if (currentValues.position !== normalizedSubmittedValues.position) {
            changes.position = normalizedSubmittedValues.position;
        }

        if (currentValues.quantity !== normalizedSubmittedValues.quantity) {
            changes.quantity = normalizedSubmittedValues.quantity;
        }

        if (currentValues.unit_price !== normalizedSubmittedValues.unit_price) {
            changes.unit_price = normalizedSubmittedValues.unit_price;
        }

        if (currentValues.markup !== normalizedSubmittedValues.markup) {
            changes.markup = normalizedSubmittedValues.markup;
        }

        if (currentValues.purchase_shipping !== normalizedSubmittedValues.purchase_shipping) {
            changes.purchase_shipping = normalizedSubmittedValues.purchase_shipping;
        }

        if (currentValues.ipi !== normalizedSubmittedValues.ipi) {
            changes.ipi = normalizedSubmittedValues.ipi;
        }

        if (currentValues.st !== normalizedSubmittedValues.st) {
            changes.st = normalizedSubmittedValues.st;
        }

        if (currentValues.extra_value !== normalizedSubmittedValues.extra_value) {
            changes.extra_value = normalizedSubmittedValues.extra_value;
        }

        if (currentValues.boarding !== normalizedSubmittedValues.boarding) {
            changes.boarding = normalizedSubmittedValues.boarding;
        }

        if (currentValues.delivery !== normalizedSubmittedValues.delivery) {
            changes.delivery = normalizedSubmittedValues.delivery;
        }

        decisions.push({
            quotation_link_id: quotationLinkId,
            item_values_id: current.id,
            changes,
        });
    }

    return success({ decisions });
};

export default compareItemValues;