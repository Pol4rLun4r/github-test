import { describe, expect, it } from "vitest";
import { getDeliveryTime } from "./deliveryTime";

describe("getDeliveryTime", () => {
    it("returns the total calendar days and date for calendar boarding plus business-day delivery", () => {
        const baseDate = new Date(2026, 9, 23);

        expect(getDeliveryTime(baseDate, 1, 1)).toEqual({
            totalCalendarDays: 3,
            deliveryDate: new Date(2026, 9, 26),
        });
    });

    it("returns the base date and zero days when both periods are zero", () => {
        const baseDate = new Date(2026, 9, 23);

        expect(getDeliveryTime(baseDate, 0, 0)).toEqual({
            totalCalendarDays: 0,
            deliveryDate: baseDate,
        });
    });
});
