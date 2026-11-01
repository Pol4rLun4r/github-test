import type { ItemFormState } from "@/features/budget/itemForm/store/itemForm.slice";

export type BudgetComparisonData = {
    quotation: Pick<Quotation, "notes" | "status">;
    items: ItemFormState[];
};

// campos que devem ser comparados para determinar se houve alterações no orçamento
const referenceFields: (keyof ItemReference)[] = [
    "id",
    "description",
    "internal_code",
    "manufacturer_code",
    "ncm",
    "notes",
];

// campos que devem ser comparados para determinar se houve alterações no orçamento
const valueFields: (keyof ItemValuesData)[] = [
    "position",
    "quantity",
    "unit_price",
    "markup",
    "purchase_shipping",
    "ipi",
    "st",
    "extra_value",
    "boarding",
    "delivery",
];

type ItemValuesData = ItemFormState["item_values"];

// verifica se dois objetos possuem os mesmos valores para os campos especificados
const sameFields = <T extends object>(
    first: T,
    second: T,
    fields: (keyof T)[],
): boolean => fields.every((field) => first[field] === second[field]);

// verifica se dois itens possuem os mesmos valores para os campos especificados
const sameItem = (first: ItemFormState, second: ItemFormState): boolean => {
    // verifica se os campos de referência e valores são iguais
    if (!sameFields(first.item_reference, second.item_reference, referenceFields)) {
        return false;
    }

    // verifica se os campos de valores são iguais
    if (!sameFields(first.item_values, second.item_values, valueFields)) {
        return false;
    }

    // verifica se os links de referência são iguais (quantidade de links)
    if (first.reference_links.length !== second.reference_links.length) {
        return false;
    }

    // verifica se todos os links de referência são iguais (conteúdo dos links)
    return first.reference_links.every(
        (link, index) => link.content === second.reference_links[index].content,
    );
};

export const hasItemChanged = (
    original: ItemFormState,
    current: ItemFormState,
): boolean => !sameItem(original, current);

export const hasBudgetChanged = (
    original: BudgetComparisonData,
    current: BudgetComparisonData,
): boolean => {

    // verifica se os campos de cotação foram alterados ou se a quantidade de itens mudou
    if (
        original.quotation.notes !== current.quotation.notes ||
        original.quotation.status !== current.quotation.status ||
        original.items.length !== current.items.length
    ) {
        // se algum desses campos foi alterado, retorna true indicando que houve alterações no orçamento
        return true;
    }
     
    // verifica se algum item foi alterado, usando 'some' para retornar true se algum item for diferente
    return original.items.some((item, index) => !sameItem(item, current.items[index]));
};
