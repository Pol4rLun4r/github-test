/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest/globals" />

// service and repo
import { createDatabase } from "../../../../db/connection.js";
import { createServices } from "../../../../services/index.js";

// utils
import { getDBPath } from "../../../../utils/pathResolver.js";
import { fakeItens } from "../../../fakeItens.js";
import { rulesCode as quotationRulesCode } from "../../../../rules/quotation/create.js";
import { rulesCode as itemRulesCode } from "../../../../rules/item/createAndAdd.js";
import { rulesCode as itemValuesRulesCode } from "../../../../rules/item/validateItemValues.js";

describe("Falhas ao criar cotação", () => {
    const db = createDatabase(getDBPath());
    const services = createServices(db);

    describe("Quotation", () => {
        it("falhar se a quantidade de itens não for informada", async () => {
            const payload: CreateQuotation = {
                items: [{
                    item_reference: { ...fakeItens[0] },
                    reference_links: [],
                    item_values: {
                        quantity: 2,
                        unit_price: 2,
                        position: 1,
                    }
                }],
                quotation: { amount: undefined as unknown as number, total_value: 431.32 }
            }

            const quotation = services.quotation.create(payload);

            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe(quotationRulesCode.AMOUNT_NOT_INFORMED);
        });

        it("falhar se o valor total não for informado", async () => {
            const payload: CreateQuotation = {
                items: [
                    {
                        item_reference: { ...fakeItens[0] },
                        reference_links: [],
                        item_values: {
                            quantity: 2,
                            unit_price: 2,
                            position: 1,
                        }
                    }
                ],
                quotation: { amount: 1, total_value: undefined as unknown as number }
            }

            const quotation = services.quotation.create(payload);

            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe(quotationRulesCode.TOTAL_VALUE_NOT_INFORMED);
        });

        it("falhar se a quantidade de itens não bater com o número de itens enviados", async () => {
            const payload: CreateQuotation = {
                items: [
                    {
                        item_reference: { ...fakeItens[0] },
                        reference_links: [],
                        item_values: {
                            quantity: 2,
                            unit_price: 2,
                            position: 1,
                        }
                    }
                ],
                quotation: { amount: 2, total_value: 431.32 }
            }

            const quotation = services.quotation.create(payload);

            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe(quotationRulesCode.AMOUNT_MISMATCH);
        });
    });

    describe("Add Items", () => {
        it("falhar se não tiver ao menos um item e a quantidade de itens não bater", async () => {
            const payload: CreateQuotation = {
                items: [],
                quotation: { amount: 1, total_value: 431.32 }
            }

            const quotation = services.quotation.create(payload);

            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe(quotationRulesCode.AMOUNT_MISMATCH);
        });

        it("falhar se o item não tiver uma posição/ordem", async () => {
            const payload: CreateQuotation = {
                items: [
                    {
                        item_reference: { ...fakeItens[0] },
                        reference_links: [],
                        item_values: {
                            quantity: 2,
                            unit_price: 2,
                            position: undefined as any,
                        }
                    }
                ],
                quotation: { amount: 1, total_value: 431.32 }
            }

            const quotation = services.quotation.create(payload);

            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe(itemRulesCode.POSITION_NOT_INFORMED);
        });

        it("falhar se mais de um item tem a mesma posição/ordem", async () => {
            const payload: CreateQuotation = {
                items: [
                    {
                        item_reference: { ...fakeItens[0] },
                        reference_links: [],
                        item_values: {
                            quantity: 2,
                            unit_price: 2,
                            position: 1,
                        }
                    },
                    {
                        item_reference: { ...fakeItens[0] },
                        reference_links: [],
                        item_values: {
                            quantity: 2,
                            unit_price: 2,
                            position: 1,
                        }
                    },
                ],
                quotation: { amount: 2, total_value: 431.32 }
            }

            const quotation = services.quotation.create(payload);

            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe(itemRulesCode.SAME_POSITION);
        });

        it("falhar se o item não tiver uma descrição", async () => {
            const payload: CreateQuotation = {
                items: [
                    {
                        item_reference: { ...fakeItens[0], description: "   " },
                        reference_links: [],
                        item_values: {
                            quantity: 2,
                            unit_price: 2,
                            position: 0,
                        }
                    }
                ],
                quotation: { amount: 1, total_value: 431.32 }
            }

            const quotation = services.quotation.create(payload);

            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe(itemRulesCode.DESCRIPTION_NOT_INFORMED);
        });

        it("falhar se o prazo de entrega for negativo", () => {
            const payload: CreateQuotation = {
                items: [{
                    item_reference: { ...fakeItens[0] },
                    reference_links: [],
                    item_values: {
                        quantity: 1,
                        position: 0,
                        delivery: -1,
                    },
                }],
                quotation: { amount: 1, total_value: 0 },
            };

            const quotation = services.quotation.create(payload);

            expect(quotation.success).toBe(false);
            expect(quotation.data).toBe(itemValuesRulesCode.INVALID_DELIVERY);
        });
    });
});