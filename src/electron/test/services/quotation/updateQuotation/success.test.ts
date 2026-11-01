/// <reference types="vitest/globals" />

// utils
import { fakeItens, fakeItemValues } from "../../../fakeItens.js";
import createTestContext from "../../../utils/createTestContext.js";
import createQuotationForTest from "../../../utils/quotation/createQuotationForTest.js";
import quotationUpdatePayloadUtils from "../../../utils/quotation/quotationUpdatePayload.js";
import { expectQuotationBaseToMatch, expectQuotationItemsToMatch } from "../../../utils/quotation/quotationAssertions.js";

describe("Sucessos ao atualizar cotação (completa)", () => {
    let context: ReturnType<typeof createTestContext>;

    let fullQuotation: QuotationFull;

    // criar cotação completa para teste
    beforeEach(() => {
        context = createTestContext();

        const quotationData = createQuotationForTest(context);
        const quotationId = quotationData[0].quotation_id;
        fullQuotation = context.services.quotation.getFull(quotationId).data as QuotationFull;
    });

    // fechar contexto de teste
    afterEach(() => {
        context.close();
    });

    it("deve atualizar as notas da cotação com sucesso", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);

        const payload = quotationUpdatePayloadUtils.withQuotationNotes(quotation, "Novo texto");

        const result = context.services.quotation.update(payload);

        if (!result.success) {
            throw new Error(result.data);
        }

        expectQuotationBaseToMatch(
            result.data as QuotationFull,
            payload.quotation,
        );
    });

    it("deve atualizar o status da cotação com sucesso", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);

        const payload = quotationUpdatePayloadUtils.withQuotationStatus(quotation, 1);

        const result = context.services.quotation.update(payload);

        if (!result.success) {
            throw new Error(result.data);
        }

        expectQuotationBaseToMatch(
            result.data as QuotationFull,
            payload.quotation,
        );
    })

    it("deve adicionar uma linha (novo item na cotação) com uma nova referência", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);

        const position = Math.max(...fullQuotation.items.map((item) => item.item_values.position)) + 1;

        const newItem: UpdateQuotation["items"][number] = {
            item_reference: { ...fakeItens[0] },
            item_values: fakeItemValues(position, { quantity: 3, unit_price: 12 }),
            reference_links: [{ content: "teste de link" }],
        };

        const payload = quotationUpdatePayloadUtils.addQuotationItem(quotation, newItem);

        const result = context.services.quotation.update(payload);

        expect(result.success).toBe(true);
        if (!result.success) return;

        const updated = result.data as QuotationFull;
        expectQuotationItemsToMatch(updated, [...quotation.items, newItem]);
    });

    it("deve adicionar uma linha (novo item na cotação) reutilizando uma referência existente sem atualizar seus dados", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);

        const existingReference = fullQuotation.items[0].item_reference;

        const position = Math.max(...fullQuotation.items.map((item) => item.item_values.position)) + 1;

        const newItem: UpdateQuotation["items"][number] = {
            item_reference: { ...existingReference, description: "Descrição adulterada" },
            item_values: fakeItemValues(position, { quantity: 1, unit_price: 8 }),
            reference_links: [],
        };

        const payload = quotationUpdatePayloadUtils.addQuotationItem(quotation, newItem);

        const result = context.services.quotation.update(payload);

        expect(result.success).toBe(true);
        if (!result.success) return;

        const updated = result.data as QuotationFull;
        expectQuotationItemsToMatch(updated, [...quotation.items, { ...newItem, item_reference: existingReference }]);
    });

    it("deve remover uma linha e seus valores sem remover a referência do item", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);

        // escolhe a primeira linha para remover (quotation_link)
        const removedItem = fullQuotation.items[0];

        // mantém as linhas restantes para comparação após a atualização
        const remainingItems = fullQuotation.items.slice(1);

        const payload = quotationUpdatePayloadUtils.removeQuotationItem(
            quotation,
            removedItem.quotation_link_id,
        );

        const result = context.services.quotation.update(payload);

        expect(result.success).toBe(true);
        if (!result.success) return;

        const updated = result.data as QuotationFull;
        expectQuotationItemsToMatch(updated, remainingItems);
        expect(context.repositories.quotation.links.getById(removedItem.quotation_link_id)).toBeUndefined(); // o vínculo/linha (quotation_link) deve ser removido
        expect(context.repositories.item.values.getById(removedItem.item_values.id!)).toBeUndefined(); // os valores do item devem ser removidos
        expect(context.repositories.item.reference.getByIdWithoutLinks(removedItem.item_reference.id!)).toBeDefined(); // a referência do item não deve ser removida
    });

    it("deve atualizar um item_values de um item/linha com sucesso", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);

        // escolhe a primeira linha para alterar o item_values
        const editItem = fullQuotation.items[0];

        const payload = quotationUpdatePayloadUtils.editQuotationItem(
            quotation,
            editItem.quotation_link_id,
            {
                ...editItem,
                item_values: fakeItemValues(editItem.item_values.position, { quantity: 30, boarding: 19, delivery: 25, unit_price: 1.2 })
            }
        );

        const result = context.services.quotation.update(payload);

        expect(result.success).toBe(true);
        if (!result.success) return;

        const updated = result.data as QuotationFull;

        expectQuotationItemsToMatch(updated, payload.items);
    })

    it("deve persistir zero como prazo de entrega", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);
        const item = fullQuotation.items[0];

        const payload = quotationUpdatePayloadUtils.editQuotationItem(
            quotation,
            item.quotation_link_id,
            { item_values: { delivery: 0 } },
        );

        const result = context.services.quotation.update(payload);

        expect(result.success).toBe(true);
        if (!result.success) return;

        const updated = result.data as QuotationFull;
        const updatedItem = updated.items.find((entry) => entry.quotation_link_id === item.quotation_link_id);

        expect(updatedItem?.item_values.delivery).toBe(0);
    });

    it("deve atualizar as posições item_values, o item 1 ganhar a segunda posição e o item 2 ganhar a primeira posição com sucesso", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);

        const itemOne = fullQuotation.items[0];
        const itemTwo = fullQuotation.items[1];

        // payload onde troca a posição do item 1 com o item 2
        const payloadWithItemOneMoved = quotationUpdatePayloadUtils.editQuotationItem(
            quotation,
            itemOne.quotation_link_id,
            { item_values: { position: itemTwo.item_values.position } },
        );

        // payload onde troca a posição do item 2 com o item 1
        const payload = quotationUpdatePayloadUtils.editQuotationItem(
            payloadWithItemOneMoved,
            itemTwo.quotation_link_id,
            { item_values: { position: itemOne.item_values.position } },
        );

        const result = context.services.quotation.update(payload);

        expect(result.success).toBe(true);
        if (!result.success) return;

        const updated = result.data as QuotationFull;

        expect(updated.items.map((item) => item.quotation_link_id)).toEqual([
            itemTwo.quotation_link_id,
            itemOne.quotation_link_id,
        ]);
        expect(updated.items.map((item) => item.item_values.position)).toEqual([
            itemOne.item_values.position,
            itemTwo.item_values.position,
        ]);
        expect(updated.items.map((item) => item.item_values.id)).toEqual([
            itemTwo.item_values.id,
            itemOne.item_values.id,
        ]);

    });

    it("deve atualizar um item/linha com um novo item_reference com sucesso", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);

        // escolhe a primeira linha para alterar o item_reference
        const editItem = fullQuotation.items[0];

        const itemReferenceEmpty: Partial<ItemReference> = {
            id: undefined,
            description: undefined,
            internal_code: undefined,
            manufacturer_code: undefined,
            ncm: undefined,
            notes: undefined,
            created_at: undefined,
            updated_at: undefined,
        };

        const payload = quotationUpdatePayloadUtils.editQuotationItem(
            quotation,
            editItem.quotation_link_id,
            {
                ...editItem,
                item_reference: { ...itemReferenceEmpty, description: "Descrição alterada", },
                reference_links: [{ content: "Novo link" }],
            }
        );

        const result = context.services.quotation.update(payload);

        expect(result.success).toBe(true);
        if (!result.success) return;

        const updated = result.data as QuotationFull;
        const expectedItems = payload.items.map((item) => item.quotation_link_id === editItem.quotation_link_id
            ? {
                ...item,
                item_reference: { description: "Descrição alterada" },
                item_values: {
                    ...item.item_values,
                    item_reference_id: updated.items.find(
                        (updatedItem) => updatedItem.quotation_link_id === editItem.quotation_link_id,
                    )?.item_reference.id,
                },
            }
            : item);

        expectQuotationItemsToMatch(updated, expectedItems);

        const updatedItem = updated.items.find((item) => item.quotation_link_id === editItem.quotation_link_id);
        expect(updatedItem?.item_reference.id).toBeDefined();
        expect(updatedItem?.item_reference.id).not.toBe(editItem.item_reference.id);
        expect(updatedItem?.item_values.item_reference_id).toBe(updatedItem?.item_reference.id);
        expect(
            context.repositories.item.values.getById(editItem.item_values.id!)?.item_reference_id,
        ).toBe(updatedItem?.item_reference.id);
    });


    it("deve atualizar um item/linha com usando outro item_reference existente com sucesso", () => {
        const quotation = quotationUpdatePayloadUtils.makeQuotationUpdatePayload(fullQuotation);

        const anotherItem = fullQuotation.items[1];
        const anotherItemReference = anotherItem.item_reference;
        const anotherItemReferenceId = anotherItemReference.id!;

        // escolhe a primeira linha para alterar o item_reference
        const editItem = fullQuotation.items[0];

        const payload = quotationUpdatePayloadUtils.editQuotationItem(
            quotation,
            editItem.quotation_link_id,
            {
                item_reference: {
                    id: anotherItemReferenceId,
                    description: "Descrição adulterada",
                },
                reference_links: [{ content: "Link adulterado" }],
            },
        );

        const result = context.services.quotation.update(payload);

        expect(result.success).toBe(true);
        if (!result.success) return;

        const updated = result.data as QuotationFull;
        const updatedItem = updated.items.find((item) => item.quotation_link_id === editItem.quotation_link_id);
        const updatedAnotherItem = updated.items.find((item) => item.quotation_link_id === anotherItem.quotation_link_id);

        expect(updatedItem?.item_reference.id).toBe(anotherItemReferenceId);
        expect(updatedItem?.item_reference.description).toBe(anotherItemReference.description);
        expect(updatedItem?.reference_links).toEqual(anotherItem.reference_links);
        expect(updatedAnotherItem?.item_reference.id).toBe(anotherItemReferenceId);
        expect(updatedItem?.item_values.item_reference_id).toBe(anotherItemReferenceId);
        expect(
            context.repositories.item.values.getById(editItem.item_values.id!)?.item_reference_id,
        ).toBe(anotherItemReferenceId);

    });

});
