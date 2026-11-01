import { describe, expect, it } from "vitest";
import { hasBudgetChanged, type BudgetComparisonData } from "./budgetComparison";

const createBudget = (): BudgetComparisonData => ({
    quotation: { notes: "Nota", status: 0 },
    items: [{
        temp_id: "temporary-id",
        toggleStMode: false,
        quotation_link_id: 7,
        item_reference: {
            id: 3,
            description: "Produto",
            internal_code: "P-1",
            manufacturer_code: "M-1",
            ncm: "1234",
        },
        item_values: {
            position: 0,
            quantity: 2,
            unit_price: 10,
            markup: "40",
            purchase_shipping: 1,
            ipi: 0,
            st: 0,
            extra_value: 0,
            boarding: 0,
            id: 11,
            item_reference_id: 3,
        },
        reference_links: [{ id: 13, content: "https://example.com" }],
    }],
});

describe("hasBudgetChanged", () => {
    it("returns false when only UI and persistence metadata differ", () => {
        const original = createBudget();
        const current = createBudget();
        current.items[0].temp_id = "another-temporary-id";
        current.items[0].toggleStMode = true;
        current.items[0].quotation_link_id = 99;
        current.items[0].item_values.id = 22;
        current.items[0].item_values.item_reference_id = 42;

        expect(hasBudgetChanged(original, current)).toBe(false);
    });

    it("detects changes to quotation fields", () => {
        const original = createBudget();
        const current = createBudget();
        current.quotation.notes = "Nota alterada";

        expect(hasBudgetChanged(original, current)).toBe(true);
    });

    it("detects changes to item reference, values, and reference links", () => {
        const cases = [
            (budget: BudgetComparisonData) => {
                budget.items[0].item_reference.description = "Outro produto";
            },
            (budget: BudgetComparisonData) => {
                budget.items[0].item_values.quantity = 3;
            },
            (budget: BudgetComparisonData) => {
                budget.items[0].reference_links[0].content = "https://changed.example";
            },
        ];

        for (const change of cases) {
            const original = createBudget();
            const current = createBudget();
            change(current);

            expect(hasBudgetChanged(original, current)).toBe(true);
        }
    });

    it("detects added, removed, and reordered items", () => {
        const original = createBudget();
        const withSecondItem = createBudget();
        withSecondItem.items.push({ ...createBudget().items[0], temp_id: "second" });
        expect(hasBudgetChanged(original, withSecondItem)).toBe(true);
        expect(hasBudgetChanged(withSecondItem, original)).toBe(true);

        const originalOrder = createBudget();
        originalOrder.items.push({
            ...createBudget().items[0],
            temp_id: "second",
            item_reference: { id: 4, description: "Outro produto" },
            item_values: { position: 1, quantity: 1 },
            reference_links: [],
        });
        const reordered = {
            quotation: originalOrder.quotation,
            items: [...originalOrder.items].reverse().map((item, index) => ({
                ...item,
                item_values: { ...item.item_values, position: index },
            })),
        };

        expect(hasBudgetChanged(originalOrder, reordered)).toBe(true);
    });
});
