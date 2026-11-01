import { Database } from "better-sqlite3";

/** pega os detalhes completos de uma cotação */
type QuotationLinkRows = {
    quotation_link_id: number;
    item_reference_id: number;
    item_values_id: number;
};

const getQuotationFullRepository = (db: Database) =>
    (quotation_id: number): QuotationFull | undefined => {

        // apenas os dados de quotation
        const quotation = db.prepare(`
            SELECT 
                id,
                status,
                notes,
                total_value,
                amount,
                datetime(trim(created_at), 'localtime') AS created_at,
                datetime(trim(updated_at), 'localtime') AS updated_at
            FROM quotations
            WHERE quotations.id = ?
        `).get(quotation_id) as Quotation | undefined;

        if (!quotation) return undefined;

        // stmt = statement (instrução/comando)

        // comando para buscar os links da cotação
        const stmtLinks = db.prepare(`
            SELECT ql.id AS quotation_link_id, ql.item_reference_id AS item_reference_id, ql.item_values_id AS item_values_id
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

        // item_values deste link (várias linhas podem repetir item_reference_id)
        const stmtItemValuesByLink = db.prepare(`
            SELECT
                id,
                item_reference_id,
                position,
                quantity,
                unit_price,
                markup,
                purchase_shipping,
                ipi,
                st,
                extra_value,
                boarding,
                delivery,
                datetime(created_at, 'localtime') AS created_at
            FROM item_values
            WHERE id = ?
            LIMIT 1
        `);

        const quotationLinks = stmtLinks.all(quotation_id) as QuotationLinkRows[];

        const items: QuotationDetailLine[] = [];

        for (const link of quotationLinks) {

            const item_reference = stmtItemReference.get(link.item_reference_id) as ItemReference | undefined;
            if (!item_reference?.id) continue;

            const reference_links = stmtReferenceLinksForRef.all(link.item_reference_id) as ReferenceLink[];

            const item_values = stmtItemValuesByLink.get(link.item_values_id) as ItemValues | undefined;
            if (!item_values?.id) continue;

            items.push({
                quotation_link_id: link.quotation_link_id,
                item_reference,
                item_values,
                reference_links,
            });
        }

        items.sort((a, b) => a.item_values.position - b.item_values.position);

        return {
            quotation,
            items,
        };
    };


export default getQuotationFullRepository;