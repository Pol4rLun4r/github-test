// types
import type { Database } from "better-sqlite3";

export const createQuotationRepository = (db: Database) =>
    ({ client_id, notes, status, amount, total_value }: CreateQuotation) => {
        const quotation = db.transaction(() => {

            // cria a cotação
            const quotationRow = db.prepare(`
            INSERT INTO quotations (client_id)
            VALUES (?)
        `).run(client_id);

            const quotationId = quotationRow.lastInsertRowid as number;

            // cria a primeira versão da cotação
            const quotationVersion = db.prepare(`
            INSERT INTO quotation_versions (quotation_id, version, status, notes, total_value, amount)
            VALUES (?, 1, ?, ?, ?, ?)
        `).run(quotationId, status, notes, total_value, amount);

            const quotationVersionId = quotationVersion.lastInsertRowid as number;

            return quotationVersionId
        })

        return quotation();
    };

export const getQuotationVersionByIdRepository = (db: Database) =>
    (quotation_version_id: number): QuotationSummary | undefined => {
        const quotationVersion = db.prepare(`
            SELECT
                quotations.id AS quotation_id,
                quotation_versions.id AS quotation_version_id,
                quotation_versions.version AS version,
                quotations.client_id AS client_id,
                clients.name AS client_name,
                clients.document AS client_document,
                quotation_versions.status AS status,
                quotation_versions.notes AS notes,
                quotation_versions.amount AS amount,
                quotation_versions.total_value AS total_value,
                datetime(quotations.created_at, 'localtime') AS created_at,
                datetime(quotation_versions.created_at, 'localtime') AS updated_at
            FROM quotation_versions
            JOIN quotations ON quotation_versions.quotation_id = quotations.id
            JOIN clients ON quotations.client_id = clients.id
            WHERE quotation_versions.id = ?
            LIMIT 1
        `).get(quotation_version_id);

        return quotationVersion as QuotationSummary | undefined;
    };

export const getQuotationByIdRepository = (db: Database) =>
    (quotation_id: number | undefined): Quotation | undefined => {
        const quotation = db.prepare(`
        SELECT * FROM quotations WHERE id = ? LIMIT 1
    `).get(quotation_id);

        return quotation as Quotation | undefined;
    };

export const getAllQuotationsRepository = (db: Database) =>
    (): Quotation[] | undefined => {
        const quotations = db.prepare(`
        SELECT * FROM quotations
    `).all();

        return quotations as Quotation[] | undefined;
    };

export const getAllQuotationsSummaryRepository = (db: Database) =>
    (): QuotationSummary[] | undefined => {
        const quotations = db.prepare(`
        /*
          Lista resumida: uma linha por cotação (pai), usando sempre a última revisão
          em quotation_versions (maior version). Novas edições criam nova linha na
          sub-tabela; não há updated_at na versão — created_at da versão = “última mudança”.
        */
        SELECT
            quotations.id AS quotation_id,
            quotation_versions.id AS quotation_version_id,
            quotation_versions.version AS version,
            quotations.client_id AS client_id,
            clients.name AS client_name,
            clients.document AS client_document,
            quotation_versions.status AS status,
            quotation_versions.notes AS notes,
            quotation_versions.amount AS amount,
            quotation_versions.total_value AS total_value,
            /* Quando o pai quotations foi criado (abertura do orçamento). */
            datetime(quotations.created_at, 'localtime') AS created_at,
            /*
              Quando esta linha de quotation_versions foi criada (= nova revisão).
              Alias updated_at para a UI; no schema é created_at da versão atual.
            */
            datetime(quotation_versions.created_at, 'localtime') AS updated_at
        FROM quotations
        /*
          Por quotation_id, pega só o número da última revisão (MAX(version)).
          UNIQUE(quotation_id, version) garante no máximo uma linha por par.
        */
        INNER JOIN (
            SELECT quotation_id, MAX(version) AS latest_version
            FROM quotation_versions
            GROUP BY quotation_id
        ) AS latest_quotation_versions
            ON latest_quotation_versions.quotation_id = quotations.id
        INNER JOIN quotation_versions
            ON quotation_versions.quotation_id = latest_quotation_versions.quotation_id
            AND quotation_versions.version = latest_quotation_versions.latest_version
        INNER JOIN clients
            ON clients.id = quotations.client_id
        /* Ordena pela revisão mais recente no tempo (não pelo id). */
        ORDER BY quotation_versions.created_at DESC
        LIMIT 50
    `).all();

        return quotations as QuotationSummary[] | undefined;
    };

type FullDetailBaseRow = {
    quotation_id: number;
    quotation_client_id: number;
    quotation_created_at: string;
    client_id: number;
    client_name: string;
    client_document: string;
    client_notes: string | null;
    client_type_client: ClientType;
    client_created_at: string;
    client_updated_at: string;
};

type QuotationLinkRows = {
    quotation_link_id: number;
    item_reference_id: number;
    item_version_id: number;
};

/*
  Cotação completa:
  1) quotations + clients
  2) quotation_versions mais recente (metadados da revisão)
  3) quotation_links por quotation_id (referência + item_version ligada ao link)
  4) Por link: item_reference → reference_links → item_version pelo quotation_links.item_version_id; ordena linhas por position
*/

export const getQuotationFullDetailRepository = (db: Database) =>
    (quotation_id: number): QuotationFullDetail | undefined => {
        // base da cotação, quotation e client
        const base = db.prepare(`
            SELECT
                quotations.id AS quotation_id,
                quotations.client_id AS quotation_client_id,
                datetime(quotations.created_at, 'localtime') AS quotation_created_at,
                clients.id AS client_id,
                clients.name AS client_name,
                clients.document AS client_document,
                clients.notes AS client_notes,
                clients.type_client AS client_type_client,
                datetime(clients.created_at, 'localtime') AS client_created_at,
                datetime(clients.updated_at, 'localtime') AS client_updated_at
            FROM quotations
            INNER JOIN clients ON clients.id = quotations.client_id
            WHERE quotations.id = ?
        `).get(quotation_id) as FullDetailBaseRow | undefined;

        if (!base) return undefined;

        // última revisão da cotação
        const quotation_version = db.prepare(`
            SELECT
                id,
                quotation_id,
                version,
                status,
                notes,
                total_value,
                amount,
                datetime(created_at, 'localtime') AS created_at
            FROM quotation_versions
            WHERE quotation_id = ?
            ORDER BY version DESC
            LIMIT 1
        `).get(quotation_id) as QuotationVersion | undefined;

        if (!quotation_version) return undefined;

        // stmt = statement (instrução/comando)
        
        // comando para buscar os links da cotação
        const stmtLinks = db.prepare(`
            SELECT ql.id AS quotation_link_id, ql.item_reference_id AS item_reference_id, ql.item_version_id AS item_version_id
            FROM quotation_links ql
            WHERE ql.quotation_id = ?
        `);

        // comando para buscar as referências de itens
        const stmtItemReference = db.prepare(`
            SELECT
                id,
                description,
                internal_code,
                manufacturer_code,
                ncm,
                notes,
                datetime(created_at, 'localtime') AS created_at,
                datetime(updated_at, 'localtime') AS updated_at
            FROM item_references
            WHERE id = ?
        `);

        // comando para buscar os links de referência de um item
        const stmtReferenceLinksForRef = db.prepare(`
            SELECT
                id,
                item_reference_id,
                content,
                datetime(created_at, 'localtime') AS created_at
            FROM reference_links
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `);

        // versão gravada neste link (várias linhas podem repetir item_reference_id)
        const stmtItemVersionByLink = db.prepare(`
            SELECT
                id,
                item_reference_id,
                position,
                version,
                quantity,
                unit_price,
                markup,
                purchase_shipping,
                ipi,
                st,
                extra_value,
                boarding,
                datetime(created_at, 'localtime') AS created_at
            FROM item_versions
            WHERE id = ?
            LIMIT 1
        `);

        const quotationLinks = stmtLinks.all(quotation_id) as QuotationLinkRows[];

        const items: QuotationDetailLine[] = [];

        for (const link of quotationLinks) {

            const item_reference = stmtItemReference.get(link.item_reference_id) as ItemReference | undefined;
            if (!item_reference?.id) continue;

            const reference_links = stmtReferenceLinksForRef.all(link.item_reference_id) as ReferenceLink[];

            const item_version = stmtItemVersionByLink.get(link.item_version_id) as ItemVersion | undefined;
            if (!item_version?.id) continue;

            items.push({
                quotation_link_id: link.quotation_link_id,
                item_reference,
                item_version,
                reference_links,
            });
        }

        items.sort((a, b) => a.item_version.position - b.item_version.position);

        return {
            quotation: {
                id: base.quotation_id,
                client_id: base.quotation_client_id,
                created_at: base.quotation_created_at,
            },
            client: {
                id: base.client_id,
                name: base.client_name,
                document: base.client_document,
                notes: base.client_notes ?? undefined,
                type_client: base.client_type_client,
                created_at: base.client_created_at,
                updated_at: base.client_updated_at,
            },
            quotation_version,
            items,
        };
    };