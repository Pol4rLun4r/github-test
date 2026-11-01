// --------------- utils ---------------
declare const __APP_VERSION__: string;

type WithUndefined<T> = {
    [K in keyof T]: T[K] | undefined;
};

// --------------- Quotation-API ---------------

/** Dados da cotação aceitos na criação. `status` é definido pelo backend (sempre rascunho). */
type CreateQuotationData = Pick<Quotation, "notes" | "amount" | "total_value">;

/** dados da cotação aceitos na criação. */
interface CreateQuotation {
    quotation: CreateQuotationData;
    items: {
        item_reference: Partial<ItemReference>;
        item_values: Partial<ItemValues>;
        reference_links: Partial<ReferenceLink>[];
    }[];
};

/** dados da cotação aceitos na atualização. */
type UpdateQuotationData = Required<Omit<Quotation, "notes" | "created_at" | "updated_at">> & Quotation

/** dados da cotação completa esperados na atualização */
interface UpdateQuotation {
    quotation: UpdateQuotationData;
    items: {
        quotation_link_id?: QuotationLink['id'];
        item_reference: Partial<ItemReference>;
        item_values: Partial<ItemValues>;
        reference_links: Partial<ReferenceLink>[];
    }[];
};

// --------------- Item-API ---------------
type GetReferenceLinks = ReferenceLink['item_reference_id'];

type GetByReferenceId = ItemValues['item_reference_id'];

type SearchItemDescription = Pick<ItemReference, "description">['description'];

type SearchItemDescriptionIsOptional = SearchItemDescription | undefined;

type AddToQuotationPayload = {
    quotation: {
        id: Quotation['id'];
        amount: Quotation['amount'];
        total_value: Quotation['total_value'];
    }
    items: {
        item_reference: Partial<ItemReference>;
        item_values: Partial<ItemValues>;
        reference_links: Partial<ReferenceLink>[];
    }[];
};

// --------------- channels and API ---------------
type EventPayloadMapping = {
    // quotation
    "quotation:create": Result<QuotationLink[] | undefined>;
    "quotation:getAllSummary": Result<Quotation[] | undefined>;
    "quotation:getFull": Result<QuotationFull | undefined>;
    "quotation:getByItemValuesId": Result<QuotationFull>;
    "quotation:update": Result<QuotationFull | undefined>;

    // item
    "item:searchDescription": Result<ItemReference[] | undefined>;
    "item:getReferenceLinks": Result<ReferenceLink[] | undefined>;
    "item:findItemReferences": Result<ItemReference[] | undefined>;
    "item:getAllValuesByReferenceId": Result<ItemValues[] | undefined>;
    "item:getValuesById": Result<ItemValues>;
    "item:getDetailsByReferenceId": Result<ItemDetails | undefined>;
    "item:updateReference": Result<ItemWithReferenceLinks | undefined>;

    // janela (frame personalizado)
    "window:minimize": void;
    "window:maximizeToggle": void;
    "window:close": void;

    // application updates
    "update:getState": AppUpdateState;
    "update:download": void;
    "update:install": void;
}

type AppUpdateStatus =
    | "idle"
    | "unsupported"
    | "checking"
    | "not-available"
    | "available"
    | "downloading"
    | "downloaded"
    | "error";

type AppUpdateState = {
    status: AppUpdateStatus;
    version?: string;
    percent?: number;
    error?: string;
};

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

interface QuotationAPI {
    create(quotation: CreateQuotation): Promise<Result<QuotationLink[] | undefined>>;
    getAllSummary(): Promise<Result<QuotationSummary[] | undefined>>;
    getFull(quotationId: Quotation['id']): Promise<Result<QuotationFull | undefined>>;
    getByItemValuesId(itemValuesId: ItemValues["id"]): Promise<Result<QuotationFull>>;
    update(quotation: UpdateQuotation): Promise<Result<QuotationFull | undefined>>;
}

interface ItemAPI {
    searchDescription(description: SearchItemDescription): Promise<Result<ItemReference[] | undefined>>;
    findItemReferences(description: SearchItemDescriptionIsOptional): Promise<Result<ItemReference[] | undefined>>;
    getReferenceLinks(itemReferenceId: GetReferenceLinks): Promise<Result<ReferenceLink[] | undefined>>;
    getAllValuesByReferenceId(itemReferenceId: GetByReferenceId): Promise<Result<ItemValues[] | undefined>>;
    getValuesById(itemValuesId: ItemValues["id"]): Promise<Result<ItemValues>>;
    getDetailsByReferenceId(itemReferenceId: GetByReferenceId): Promise<Result<ItemDetails | undefined>>;
    updateReference(payload: UpdateItemReferencePayload): Promise<Result<ItemWithReferenceLinks | undefined>>;
}

interface WindowAPI {
    minimize(): Promise<void>;
    maximizeToggle(): Promise<void>;
    close(): Promise<void>;
}

interface AppUpdateAPI {
    getState(): Promise<AppUpdateState>;
    onStateChange(callback: (state: AppUpdateState) => void): () => void;
    download(): Promise<void>;
    install(): Promise<void>;
}

interface API {
    quotation: QuotationAPI;
    item: ItemAPI;
    window: WindowAPI;
    updates: AppUpdateAPI;
};

interface Window {
    api: API;
};