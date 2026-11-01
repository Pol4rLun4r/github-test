/// <reference types="vitest/globals" />

import updateItemReference, { rulesCode } from "../../../rules/item/updateItemReference.js";

describe("updateItemReference rule", () => {
    const payload: UpdateItemReferencePayload = {
        item_reference: {
            id: 12,
            description: "  Item description  ",
            internal_code: "  CODE  ",
        },
        reference_links: [
            { id: 21, content: "  https://example.com/old  " },
            { content: " https://example.com/new " },
        ],
    };
    const existingReferenceLinks: ReferenceLink[] = [
        { id: 21, item_reference_id: 12, content: "https://example.com/old" },
    ];

    it("validates and normalizes the reference and links", () => {
        expect(updateItemReference({
            payload,
            itemReferenceExists: true,
            existingReferenceLinks,
        })).toEqual({
            success: true,
            data: {
                item_reference: {
                    id: 12,
                    description: "Item description",
                    internal_code: "CODE",
                    manufacturer_code: null,
                    ncm: null,
                    notes: null,
                },
                reference_links: [
                    { id: 21, content: "https://example.com/old" },
                    { content: "https://example.com/new" },
                ],
            },
        });
    });

    it("rejects an invalid reference ID", () => {
        const response = updateItemReference({
            payload: { ...payload, item_reference: { ...payload.item_reference, id: 0 } },
            itemReferenceExists: true,
            existingReferenceLinks,
        });

        expect(response).toEqual({ success: false, data: rulesCode.ITEM_REFERENCE_ID_INVALID });
    });

    it("rejects a link ID not owned by the reference", () => {
        const response = updateItemReference({
            payload: { ...payload, reference_links: [{ id: 99, content: "https://example.com" }] },
            itemReferenceExists: true,
            existingReferenceLinks,
        });

        expect(response).toEqual({
            success: false,
            data: rulesCode.REFERENCE_LINK_NOT_FOUND(99),
        });
    });

    it("rejects duplicate link IDs", () => {
        const response = updateItemReference({
            payload: {
                ...payload,
                reference_links: [
                    { id: 21, content: "https://example.com/one" },
                    { id: 21, content: "https://example.com/two" },
                ],
            },
            itemReferenceExists: true,
            existingReferenceLinks,
        });

        expect(response).toEqual({
            success: false,
            data: rulesCode.DUPLICATE_REFERENCE_LINK_ID(21),
        });
    });
});
