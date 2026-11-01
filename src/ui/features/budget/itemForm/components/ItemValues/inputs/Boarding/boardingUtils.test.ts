import { describe, expect, it } from "vitest";
import { getDeliveryDate } from "./boardingUtils";

describe("getDeliveryDate", () => {
    it("soma dias corridos de embarque e dias úteis de entrega", () => {
        const baseDate = new Date(2026, 9, 23);

        expect(getDeliveryDate(baseDate, 1, 1)).toEqual(new Date(2026, 9, 26));
    });

    it("retorna a data base quando não há dias de embarque nem de entrega", () => {
        const baseDate = new Date(2026, 9, 23);

        expect(getDeliveryDate(baseDate, 0, 0)).toEqual(baseDate);
    });
});
