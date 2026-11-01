/// <reference types="vitest/globals" />

import createTestContext from "../../utils/createTestContext.js";

describe("updateItemReference repository workflow", () => {
    let context: ReturnType<typeof createTestContext>;

    beforeEach(() => {
        context = createTestContext();
    });

    afterEach(() => {
        context.close();
    });

    it("updates the reference, preserves and edits existing links, adds new links, and removes omitted links", () => {
        const { repositories, db } = context;

        const itemReferenceId = repositories.item.reference.create({
            description: "Original description",
            internal_code: "OLD",
            notes: "Old notes",
        });
        const retainedLinkId = repositories.item.referenceLinks.create(itemReferenceId, {
            item_reference_id: itemReferenceId,
            content: "https://example.com/old",
        });
        const removedLinkId = repositories.item.referenceLinks.create(itemReferenceId, {
            item_reference_id: itemReferenceId,
            content: "https://example.com/remove",
        });

        const updated = repositories.workFlows.updateItemReference({
            item_reference: {
                id: itemReferenceId,
                description: "  Updated description  ",
                internal_code: "NEW",
                manufacturer_code: "MFR-1",
                ncm: "1234",
                notes: "Updated notes",
            },
            reference_links: [
                { id: retainedLinkId, content: "  https://example.com/updated  " },
                { content: " https://example.com/new " },
            ],
        });

        expect(updated).toMatchObject({
            id: itemReferenceId,
            description: "Updated description",
            internal_code: "NEW",
            manufacturer_code: "MFR-1",
            ncm: "1234",
            notes: "Updated notes",
            reference_links: [
                { id: retainedLinkId, content: "https://example.com/updated" },
                { content: "https://example.com/new" },
            ],
        });
        expect(updated?.reference_links).toHaveLength(2);
        expect(db.prepare("SELECT id FROM reference_links WHERE id = ?").get(removedLinkId)).toBeUndefined();
    });

    it("rolls back all changes when a supplied link ID does not belong to the reference", () => {
        const { repositories } = context;

        const itemReferenceId = repositories.item.reference.create({
            description: "Reference that must remain unchanged",
        });
        const linkId = repositories.item.referenceLinks.create(itemReferenceId, {
            item_reference_id: itemReferenceId,
            content: "https://example.com/original",
        });

        expect(() => repositories.workFlows.updateItemReference({
            item_reference: {
                id: itemReferenceId,
                description: "Changed description",
            },
            reference_links: [{ id: Number.MAX_SAFE_INTEGER, content: "https://example.com/invalid" }],
        })).toThrow();

        expect(repositories.item.reference.getById(itemReferenceId)).toMatchObject({
            description: "Reference that must remain unchanged",
            reference_links: [{ id: linkId, content: "https://example.com/original" }],
        });
    });
});
