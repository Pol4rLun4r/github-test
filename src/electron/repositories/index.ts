import type { Database } from "better-sqlite3";

// item
import itemReferenceRepository from "./itemReference.repository.js";
import itemValuesRepository from "./itemValues.repository.js";
import referenceLinksRepository from "./referenceLinks.repository.js";

// quotation
import quotationRepository from "./quotation.repository.js";
import quotationLinksRepository from "./quotationLinks.repository.js";

// workflows
import addItemToQuotationRepository from "./workFlows/addToQuotation.repository.js";
import getQuotationFullRepository from "./workFlows/getFullQuotation.repository.js";
import updateItemReferenceRepository from "./workFlows/updateItemReference.repository.js";

export const createRepositories = (db: Database) => ({
    quotation: {
        base: quotationRepository(db),
        links: quotationLinksRepository(db),
    },
    item: {
        reference: itemReferenceRepository(db),
        values: itemValuesRepository(db),
        referenceLinks: referenceLinksRepository(db),
    },
    workFlows: {
        addItemToQuotation: addItemToQuotationRepository(db),
        getQuotationFull: getQuotationFullRepository(db),
        updateItemReference: updateItemReferenceRepository(db),
    }
});

export type Repositories = ReturnType<typeof createRepositories>;