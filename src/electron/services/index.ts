import type { Database } from "better-sqlite3";

// client
import createClientService from "./client/createClient.service.js";
import searchClientsService from "./client/searchClients.service.js";

// quotation
import createQuotationService from "./quotation/createQuotation.service.js";
import createQuotationWithItemsService from "./quotation/createQuotationWithItems.service.js";
import getAllQuotationsSummaryService from "./quotation/getAllQuotationsSummary.service.js";
import getQuotationFullDetailService from "./quotation/getQuotationFullDetail.service.js";

// item
import searchItemDescriptionService from "./item/searchItemDescription.service.js";
import createItemNoteService from "./item/createItemNote.service.js";
import getItemNotesService from "./item/getItemNotes.service.js";
import getReferenceLinksService from "./item/getReferenceLinks.service.js";
import getAllItemReferenceBySearchService from "./item/getAllItemReferenceBySearch.service.js";
import getAllItemVersionReferenceIdService from './item/getAllItemVersionByReferenceId.service.js';

export const createServices = (db: Database) => ({
    client: {
        create: createClientService(db),
        search: searchClientsService(db)
    },
    quotation: {
        create: createQuotationService(db),
        createWithItems: createQuotationWithItemsService(db),
        getAllSummary: getAllQuotationsSummaryService(db),
        getFullDetail: getQuotationFullDetailService(db),
    },
    item: {
        getNotes: getItemNotesService(db),
        getReferenceLinks: getReferenceLinksService(db),
        createNote: createItemNoteService(db),
        searchDescription: searchItemDescriptionService(db),
        getAllBySearch: getAllItemReferenceBySearchService(db),
        getAllVersionByReferenceId: getAllItemVersionReferenceIdService(db)
    }
})

export type Services = ReturnType<typeof createServices>;