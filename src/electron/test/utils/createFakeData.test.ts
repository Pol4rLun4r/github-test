/// <reference types="vitest/globals" />

import { createDatabase } from "../../db/connection.js";
import { createFakeData } from "../../utils/createFakeData.js";
import { fakeItens } from "../fakeItens.js";

describe("createFakeData", () => {
    it("cria 50 orçamentos usando as referências persistidas", () => {
        const previousNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = "development";

        const db = createDatabase(":memory:");

        try {
            createFakeData(db);

            const quotations = db.prepare("SELECT COUNT(*) AS count FROM quotations").get() as { count: number };
            const itemReferences = db.prepare("SELECT COUNT(*) AS count FROM item_references").get() as { count: number };
            const quotationLinks = db.prepare("SELECT COUNT(*) AS count FROM quotation_links").get() as { count: number };

            expect(quotations.count).toBe(50);
            expect(itemReferences.count).toBe(fakeItens.length);
            expect(quotationLinks.count).toBeGreaterThanOrEqual(50);
        } finally {
            db.close();
            if (previousNodeEnv === undefined) {
                delete process.env.NODE_ENV;
            } else {
                process.env.NODE_ENV = previousNodeEnv;
            }
        }
    });
});
