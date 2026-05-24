import type { Database } from "better-sqlite3";

import {
    createClientRepository,
    getClientByIdRepository,
    getClientByDocumentRepository,
    searchClientsByDocumentRepository,
    searchClientsByNameRepository,
    deleteAllClientsRepository,
} from "./client.repository.js";

import {
    createQuotationRepository,
    getAllQuotationsRepository,
    getQuotationByIdRepository,
    getQuotationVersionByIdRepository,
    getAllQuotationsSummaryRepository,
    getQuotationFullDetailRepository,
} from "./quotation.repository.js";

import {
    addItemsToQuotationVersionRepository,
    createItemReferenceRepository,
    getItemReferenceByIdRepository,
    getReferenceLinksByReferenceIdRepository,
    getItemVersionByIdRepository,
    searchItemReferencesByDescriptionRepository,
    deleteAllItemReferencesRepository,
    createReferenceLinkRepository,
    updateItemReferenceNotesRepository,
    getAllItemReferencesRepository,
    getAllItemVersionByIdRepository
} from "./item.repository.js";

export const createRepositories = (db: Database) => ({
    client: {
        create: createClientRepository(db),
        getById: getClientByIdRepository(db),
        getByDocument: getClientByDocumentRepository(db),
        searchByDocument: searchClientsByDocumentRepository(db),
        searchByName: searchClientsByNameRepository(db),
        deleteAll: deleteAllClientsRepository(db)
    },
    quotation: {
        create: createQuotationRepository(db),
        getAll: getAllQuotationsRepository(db),
        getById: getQuotationByIdRepository(db),
        getByVersionId: getQuotationVersionByIdRepository(db),
        getAllSummary: getAllQuotationsSummaryRepository(db),
        getFullDetail: getQuotationFullDetailRepository(db),
    },
    item: {
        createReferenceLink: createReferenceLinkRepository(db),
        createReference: createItemReferenceRepository(db),
        addToQuotation: addItemsToQuotationVersionRepository(db),
        getReferenceById: getItemReferenceByIdRepository(db),
        getVersionById: getItemVersionByIdRepository(db),
        getReferenceLinksByReferenceId: getReferenceLinksByReferenceIdRepository(db),
        getAllVersionByReferenceId: getAllItemVersionByIdRepository(db),
        searchByDescription: searchItemReferencesByDescriptionRepository(db),
        deleteAllReferences: deleteAllItemReferencesRepository(db),
        updateReferenceNotes: updateItemReferenceNotesRepository(db),
        getAllItemReferences: getAllItemReferencesRepository(db)
    },
});

export type Repositories = ReturnType<typeof createRepositories>;