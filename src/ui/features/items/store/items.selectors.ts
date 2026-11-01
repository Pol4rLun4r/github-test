import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

import calcAddItem from "@/utils/calcAddItem";

const selectLatestPrice = (state: RootState) => state.items.itemDetails.latestPrice;
const selectEditedItemReference = (state: RootState) => state.items.editItemReference;

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export const selectLatestPriceFormatted = createSelector(
    [selectLatestPrice],
    (latestPrice) => {
        if (!latestPrice || latestPrice.quantity <= 0) return "—";

        const finalUnitValue = calcAddItem(latestPrice).finalUnitValue;

        return Number.isFinite(finalUnitValue)
            ? brl.format(finalUnitValue)
            : "—";
    },
);

export const selectItemReferenceUpdatePayload = createSelector(
    [selectEditedItemReference],
    (itemReference): UpdateItemReferencePayload | undefined => {
        if (!itemReference) return undefined;

        return {
            item_reference: {
                id: itemReference.id,
                description: itemReference.description,
                internal_code: itemReference.internal_code,
                manufacturer_code: itemReference.manufacturer_code,
                ncm: itemReference.ncm,
                notes: itemReference.notes,
            },
            reference_links: itemReference.reference_links.map(({ id, content }) => ({
                ...(id === undefined ? {} : { id }),
                content,
            })),
        };
    },
);

export const isHasChangeItemReferenceWithLinks = createSelector(
    [selectEditedItemReference],
    (itemReference) => {
        if (!itemReference) return false;

        const { originalItem } = itemReference;

        const editableFields = [
            "description",
            "internal_code",
            "manufacturer_code",
            "ncm",
            "notes",
        ] as const;

        const hasReferenceFieldChanges = editableFields.some(
            (field) => (itemReference[field] ?? "") !== (originalItem[field] ?? ""),
        );

        if (hasReferenceFieldChanges) return true;

        return (
            itemReference.reference_links.length !== originalItem.reference_links.length ||
            itemReference.reference_links.some((link, index) => {
                const originalLink = originalItem.reference_links[index];

                return (
                    !originalLink ||
                    link.id !== originalLink.id ||
                    link.content !== originalLink.content
                );
            })
        );
    },
);
