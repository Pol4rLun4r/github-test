
import { fakeItens, fakeItemValues } from "../fakeItens.js";

/** monta payload para criação de cotação (completa) */
const makeCreateQuotation = (
    overrides: Partial<CreateQuotation> = {}
): CreateQuotation => {
    return {
        quotation: {
            notes: "cotação de teste",
            amount: 2,
            total_value: 2
        },
        items: [
            {
                item_reference: { ...fakeItens[0] },
                reference_links: [],
                item_values: fakeItemValues(1)
            },
            {
                item_reference: { ...fakeItens[2] },
                reference_links: [],
                item_values: fakeItemValues(2, {quantity: 5, unit_price: 12})
            },
        ],
        ...overrides,
    };
};

export default makeCreateQuotation;