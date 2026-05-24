import { describe, expect, it } from "vitest";
import { normalizeBrazilianCurrency } from "./formatBrazilPrice";

describe("parseBrazilianCurrency", () => {
    it("parse valor com R$ e separadores pt-BR", () => {
        expect(normalizeBrazilianCurrency("R$ 3.339,00")).toBe(3339);
    });

    it("parse valor sem prefixo", () => {
        expect(normalizeBrazilianCurrency("3.339,00")).toBe(3339);
        expect(normalizeBrazilianCurrency("3339,00")).toBe(3339);
    });

    it("parse valor sem centavos", () => {
        expect(normalizeBrazilianCurrency("R$3.339")).toBe(3339);
    });
});
