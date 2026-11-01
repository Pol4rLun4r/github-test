// --------------- Quotation ---------------

// cotação
type Quotation = {
    id?: number;
    status?: QuotationStatus | undefined;
    notes?: string;
    total_value: number;
    amount: number;
    created_at?: string;
    updated_at?: string;
};

// Status por versão: 0 = rascunho, 1 = enviado
type QuotationStatus = 0 | 1;

type QuotationItemToAdd = {
    item_reference: ItemReference;
    item_values: Omit<ItemValues, "id" | "item_reference_id" | "created_at" | "updated_at">;
    reference_links: Pick<ReferenceLink, "content">[];
};

type QuotationLink = {
    id?: number;
    quotation_id: number;
    item_reference_id: number;
    item_values_id: number;
    created_at?: string;
    updated_at?: string;
};

/** Uma linha da cotação completa */
type QuotationDetailLine = {
    quotation_link_id: number;
    item_reference: ItemReference;
    item_values: ItemValues;
    reference_links: ReferenceLink[];
};

/** Cotação completa */
type QuotationFull = {
    quotation: Quotation;
    items: QuotationDetailLine[];
};

// --------------- Item ---------------

// referência do item – dados mestres (descrição, código, NCM). Criada uma vez
type ItemReference = {
    id?: number;
    description: string;
    internal_code?: string;
    manufacturer_code?: string;
    ncm?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
};

type ReferenceLink = {
    id?: number;
    item_reference_id: number;
    content: string;
    created_at?: string;
}

// valores do item – dados mutáveis (preço, quantidade, etc)
type ItemValues = {
    id?: number;
    item_reference_id: number;
    position: number; // posição do item na cotação (ordem)
    quantity: number;
    unit_price?: number;
    markup?: string;
    purchase_shipping?: number;
    ipi?: number;
    st?: number;
    extra_value?: number;
    boarding?: number; // tempo para embarcar o item
    delivery?: number; // tempo para entregar o item
    created_at?: string;
    updated_at?: string;
};

type ItemWithReferenceLinks = ItemReference & {
    reference_links: ReferenceLink[];
};

type UpdatableItemReference = Omit<
    ItemReference,
    "internal_code" | "manufacturer_code" | "ncm" | "notes"
> & {
    internal_code?: string | null;
    manufacturer_code?: string | null;
    ncm?: string | null;
    notes?: string | null;
};

type UpdateItemReferencePayload = {
    item_reference: UpdatableItemReference;
    reference_links: Pick<ReferenceLink, "id" | "content">[];
};

type ItemData = {
    item_reference: ItemReference;
    item_values: ItemValues;
    reference_links: ReferenceLink[];
};

// type que presenta os detalhes de um item
type ItemDetails = {
    item_with_reference_links: ItemWithReferenceLinks;
    item_values_records: number | undefined;
    latest_price: ItemValues | undefined;
}