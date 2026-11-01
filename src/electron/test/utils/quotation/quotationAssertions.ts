import { expect } from "vitest";

type ExpectedQuotationItem = {
    quotation_link_id?: number;
    item_reference?: Partial<ItemReference>;
    item_values?: Partial<ItemValues>;
    reference_links?: Partial<ReferenceLink>[];
};

/** Verifica os campos da cotação base que importam para o cenário. */
export const expectQuotationBaseToMatch = (
    actual: QuotationFull,
    expected: Partial<Quotation>,
): void => {
    const expectedWithoutTimestamps = { ...expected };
    delete expectedWithoutTimestamps.created_at;
    delete expectedWithoutTimestamps.updated_at;

    expect(actual.quotation).toMatchObject(expectedWithoutTimestamps);
};

/** Verifica as linhas, a quantidade declarada e a quantidade retornada. */
export const expectQuotationItemsToMatch = (
    actual: QuotationFull,
    expectedItems: ExpectedQuotationItem[],
): void => {
    expect(actual.items).toHaveLength(expectedItems.length);
    expect(actual.quotation.amount).toBe(expectedItems.length);

    expectedItems.forEach((expectedItem, index) => {
        expect(actual.items[index]).toMatchObject(expectedItem);
    });
};
