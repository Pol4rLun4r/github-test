// --------------- Client ---------------

// tipo de cliente (padrão nacional)
type ClientType = "nacional" | "internacional";

// dados do cliente
type Client = {
    id?: number;
    name: string;
    document: string;
    type_client: ClientType;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

// --------------- Quotation ---------------

// versão container da cotação
type Quotation = {
    id?: number;
    client_id: number;
    created_at?: string;
};

// Status por versão: 0 = rascunho, 1 = aprovado, 2 = outro (ex.: omie) 
type QuotationStatus = 0 | 1 | 2;

// versão que carrega variações da cotação
type QuotationVersion = {
    id?: number;
    quotation_id: number;
    version: number;
    status: QuotationStatus | undefined;
    notes?: string;
    total_value: number;
    amount: number;
    created_at?: string;
};

// versão resumida da cotação para listagem
type QuotationSummary = {
    quotation_id: number;
    quotation_version_id: number;
    /** Número da revisão exibida (MAX(version) por cotação). */
    version: number;
    client_id: number;
    client_name: string;
    client_document: string;
    status: QuotationStatus;
    notes: string | null;
    total_value: number;
    amount: number;
    /** Criação do registro pai em `quotations` (abertura da cotação). */
    created_at: string;
    /** Momento em que a versão atual foi gravada (`quotation_versions.created_at`). */
    updated_at: string;
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

// type ItemNoteType = "text" | "link";

type ReferenceLink = {
    id?: number;
    item_reference_id: number;
    content: string;
    created_at?: string;
}

// valores do item – dados mutáveis (preço, quantidade, etc). Criada a cada edição.
type ItemVersion = {
    id?: number;
    item_reference_id: number;
    position: number; // posição do item na cotação (ordem)
    version: number;
    quantity: number;
    unit_price?: number;
    markup?: string;
    purchase_shipping?: number;
    ipi?: number;
    st?: number;
    created_at?: string;
    extra_value?: number;
    boarding?: string;
};

type ItemWithReferenceLinks = ItemReference & {
    reference_links: ReferenceLink[];
};

type ItemData = {
    item_reference: ItemReference;
    item_version: ItemVersion;
    reference_links: ReferenceLink[];
};

type QuotationLink = {
    id?: number;
    quotation_id: number;
    item_reference_id: number;
    item_version_id: number;
    created_at?: string;
};

/** Uma linha da cotação completa: vínculo + snapshot do item na última versão. */
type QuotationDetailLine = {
    quotation_link_id: number;
    item_reference: ItemReference;
    item_version: ItemVersion;
    reference_links: ReferenceLink[];
};

/** Cotação completa para a tela “ver detalhes”: pai, cliente, última revisão e itens via quotation_links. */
type QuotationFullDetail = {
    quotation: Quotation;
    client: Client;
    quotation_version: QuotationVersion;
    items: QuotationDetailLine[];
};