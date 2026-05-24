// --------------- utils ---------------
type WithUndefined<T> = {
    [K in keyof T]: T[K] | undefined;
};

// --------------- Quotation-API ---------------
interface CreateQuotation extends Partial<Pick<Quotation, "client_id">>, Pick<QuotationVersion, "notes" | "status" | 'total_value' | 'amount'> { }

interface CreateWithAllData {
    client: Client;
    quotation: CreateQuotation;
    items: {
        item_reference: Partial<ItemReference>;
        item_version: Partial<ItemVersion>;
        reference_links: Partial<ReferenceLink>[];
    }[];
};

// --------------- Item-API ---------------
type GetItemNotes = NonNullable<ItemReference['id']>;

type GetReferenceLinks = ReferenceLink['item_reference_id'];

type GetByReferenceId = ItemVersion['item_reference_id'];

type CreateItemNote = {
    item_reference_id: number;
    notes: string;
};

type SearchItemDescription = Pick<ItemReference, "description">['description'];

type SearchItemDescriptionIsOptional = SearchItemDescription | undefined;

// --------------- Client-API ---------------
interface SearchClient {
    value: string;
    type: 'document' | 'name';
}

// --------------- channels and API ---------------
type EventPayloadMapping = {
    // client
    "client:create": Result<Client | undefined>;
    "client:search": Result<Client[] | undefined>;

    // quotation
    "quotation:create": Result<QuotationSummary | undefined>;
    "quotation:createWithItems": Result<QuotationLink[] | undefined>;
    "quotation:getAllSummary": Result<QuotationSummary[] | undefined>;
    "quotation:getFullDetail": Result<QuotationFullDetail | undefined>;

    // item
    "item:searchDescription": Result<ItemReference[] | undefined>;
    "item:getNotes": Result<ItemReference['notes'] | undefined>;
    "item:getReferenceLinks": Result<ReferenceLink[] | undefined>;
    "item:createNote": Result<ItemReference['id'] | undefined>;
    "item:getAllBySearch": Result<ItemReference[] | undefined>;
    "item:getAllVersionByReferenceId": Result<ItemVersion[] | undefined>;

    // janela (frame personalizado)
    "window:minimize": void;
    "window:maximizeToggle": void;
    "window:close": void;
}

// --------------- API ---------------
type SuccessResponse<T> = {
    success: true;
    data: T;
    code?: string;
};
type FailureResponse = {
    success: false;
    data: string;
    code?: string;
};

type Result<T> = FailureResponse | SuccessResponse<T>;

interface ClientAPI {
    create(client: Client): Promise<Result<Client | undefined>>;
    search(query: SearchClient): Promise<Result<Client[] | undefined>>;
};

interface QuotationAPI {
    create(quotation: CreateQuotation): Promise<Result<QuotationSummary | undefined>>;
    createWithItems(quotation: CreateWithAllData): Promise<Result<QuotationLink[] | undefined>>;
    getAllSummary(): Promise<Result<QuotationSummary[] | undefined>>;
    getFullDetail(quotationId: Quotation['id']): Promise<Result<QuotationFullDetail | undefined>>;
}

interface ItemAPI {
    searchDescription(description: SearchItemDescription): Promise<Result<ItemReference[] | undefined>>;
    getNotes(itemReferenceId: GetItemNotes): Promise<Result<ItemReference['notes'] | undefined>>;
    getReferenceLinks(itemReferenceId: GetReferenceLinks): Promise<Result<ReferenceLink[] | undefined>>;
    createNote(note: CreateItemNote): Promise<Result<ItemReference['id'] | undefined>>;
    getAllBySearch(description: SearchItemDescriptionIsOptional): Promise<Result<ItemReference[] | undefined>>;
    getAllVersionByReferenceId(itemReferenceId: GetByReferenceId): Promise<Result<ItemVersion[] | undefined>>;
}

interface WindowAPI {
    minimize(): Promise<void>;
    maximizeToggle(): Promise<void>;
    close(): Promise<void>;
}

interface API {
    client: ClientAPI;
    quotation: QuotationAPI;
    item: ItemAPI;
    window: WindowAPI;
};

interface Window {
    api: API;
};