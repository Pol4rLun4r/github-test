type QuotationUpdateItem = UpdateQuotation["items"][number];

type QuotationItemChanges = {
    item_reference?: Partial<ItemReference>;
    item_values?: Partial<ItemValues>;
    reference_links?: Partial<ReferenceLink>[];
};

/** cria um payload de atualização a partir da cotação completa atual. */
export const makeQuotationUpdatePayload = (
    current: QuotationFull,
): UpdateQuotation => {
    const quotationId = current.quotation.id;

    if (quotationId === undefined) {
        throw new Error("A cotação precisa ter um ID para ser atualizada.");
    }

    return {
        quotation: {
            id: quotationId,
            status: current.quotation.status ?? 0,
            notes: current.quotation.notes,
            amount: current.items.length,
            total_value: current.quotation.total_value,
        },
        items: current.items.map(({ quotation_link_id, item_reference, item_values, reference_links }) => ({
            quotation_link_id,
            item_reference: { ...item_reference },
            item_values: { ...item_values },
            reference_links: reference_links.map((link) => ({ ...link })),
        })),
    };
};

/** cria uma cópia do payload com as notas da cotação alteradas. */
export const withQuotationNotes = (
    payload: UpdateQuotation,
    notes: string | undefined,
): UpdateQuotation => ({
    ...payload,
    quotation: { ...payload.quotation, notes },
});

/** cria uma cópia do payload com o status da cotação alterado. */
export const withQuotationStatus = (
    payload: UpdateQuotation,
    status: 0 | 1,
): UpdateQuotation => ({
    ...payload,
    quotation: { ...payload.quotation, status },
});

/** substitui as linhas e mantém a quantidade da cotação consistente. */
export const withQuotationItems = (
    payload: UpdateQuotation,
    items: QuotationUpdateItem[],
): UpdateQuotation => ({
    ...payload,
    quotation: { ...payload.quotation, amount: items.length },
    items: items.map((item) => ({
        ...item,
        item_reference: { ...item.item_reference },
        item_values: { ...item.item_values },
        reference_links: item.reference_links.map((link) => ({ ...link })),
    })),
});

/** adiciona uma nova linha ao payload, sem ID de vínculo. */
export const addQuotationItem = (
    payload: UpdateQuotation,
    item: QuotationUpdateItem,
): UpdateQuotation => {
    if (item.quotation_link_id !== undefined) {
        throw new Error("Uma nova linha não deve informar quotation_link_id.");
    }

    return withQuotationItems(payload, [...payload.items, item]);
};

/** remove uma linha existente do payload pelo ID do vínculo. */
export const removeQuotationItem = (
    payload: UpdateQuotation,
    quotationLinkId: number,
): UpdateQuotation => {
    if (!payload.items.some((item) => item.quotation_link_id === quotationLinkId)) {
        throw new RangeError(`Não existe linha com quotation_link_id ${quotationLinkId}.`);
    }

    return withQuotationItems(
        payload,
        payload.items.filter((item) => item.quotation_link_id !== quotationLinkId),
    );
};

/** edita os dados de uma linha existente pelo ID do vínculo. */
export const editQuotationItem = (
    payload: UpdateQuotation,
    quotationLinkId: number,
    changes: QuotationItemChanges,
): UpdateQuotation => {
    if (!payload.items.some((item) => item.quotation_link_id === quotationLinkId)) {
        throw new RangeError(`Não existe linha com quotation_link_id ${quotationLinkId}.`);
    }

    return withQuotationItems(
        payload,
        payload.items.map((item) => item.quotation_link_id === quotationLinkId
            ? {
                ...item,
                item_reference: { ...item.item_reference, ...changes.item_reference },
                item_values: { ...item.item_values, ...changes.item_values },
                reference_links: changes.reference_links
                    ? changes.reference_links.map((link) => ({ ...link }))
                    : item.reference_links,
            }
            : item,
        ),
    );
};

/** altera os valores de uma linha sem modificar o payload original. */
export const withQuotationItemValues = (
    payload: UpdateQuotation,
    itemIndex: number,
    changes: Partial<ItemValues>,
): UpdateQuotation => {
    const item = payload.items[itemIndex];

    if (!item) {
        throw new RangeError(`Não existe item no índice ${itemIndex}.`);
    }

    return {
        ...payload,
        items: payload.items.map((currentItem, index) =>
            index === itemIndex
                ? { ...currentItem, item_values: { ...currentItem.item_values, ...changes } }
                : currentItem,
        ),
    };
};

/** altera os dados de referência de uma linha sem modificar o payload original. */
export const withQuotationItemReference = (
    payload: UpdateQuotation,
    itemIndex: number,
    changes: Partial<ItemReference>,
): UpdateQuotation => {
    const item = payload.items[itemIndex];

    if (!item) {
        throw new RangeError(`Não existe item no índice ${itemIndex}.`);
    }

    return {
        ...payload,
        items: payload.items.map((currentItem, index) =>
            index === itemIndex
                ? { ...currentItem, item_reference: { ...currentItem.item_reference, ...changes } }
                : currentItem,
        ),
    };
};

const quotationUpdatePayloadUtils = {
    makeQuotationUpdatePayload,
    withQuotationNotes,
    withQuotationStatus,
    withQuotationItems,
    addQuotationItem,
    removeQuotationItem,
    editQuotationItem,
    withQuotationItemValues,
    withQuotationItemReference,
};

export default quotationUpdatePayloadUtils;