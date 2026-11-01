import type { Database } from "better-sqlite3";

// quotation
import createQuotationService from "./quotation/createQuotation.service.js";
import getAllQuotationsSummaryService from "./quotation/getAllQuotationsSummary.service.js";
import getQuotationFullService from "./quotation/getQuotationFull.service.js";
import getQuotationByItemValuesIdService from "./quotation/getQuotationByItemValuesId.service.js";

// item
import searchDescriptionService from "./item/searchDescription.service.js";
import findItemReferences from "./item/findItemReferences.service.js";
import getReferenceLinksService from "./item/getReferenceLinks.service.js";
import getAllItemValuesByReferenceIdService from "./item/getAllItemValuesByReferenceId.service.js";
import getItemValuesByIdService from "./item/getItemValuesById.service.js";
import getItemDetailsByReferenceIdService from "./item/getItemDetailsByReferenceId.service.js";
import updateItemReferenceService from "./item/updateItemReference.service.js";
import updateQuotation from "./quotation/updateQuotation.service.js";

export const createServices = (db: Database) => ({
    quotation: {
        create: createQuotationService(db),
        getAllSummary: getAllQuotationsSummaryService(db),
        getFull: getQuotationFullService(db),
        getByItemValuesId: getQuotationByItemValuesIdService(db),
        update: updateQuotation(db)
    },
    item: {
        searchDescription: searchDescriptionService(db),
        findItemReferences: findItemReferences(db),
        getReferenceLinks: getReferenceLinksService(db),
        getAllItemValuesByReferenceId: getAllItemValuesByReferenceIdService(db),
        getItemValuesById: getItemValuesByIdService(db),
        getItemDetailsByReferenceId: getItemDetailsByReferenceIdService(db),
        updateItemReference: updateItemReferenceService(db),
    }
})

export type Services = ReturnType<typeof createServices>;