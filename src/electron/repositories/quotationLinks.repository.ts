import { Database } from "better-sqlite3";

/** criar link de cotação */
const create = (db: Database) =>
    (quotation_id: QuotationLink['quotation_id'], item_reference_id: QuotationLink['item_reference_id'], item_values_id: QuotationLink['item_values_id']): number => {
        const row = db.prepare(`
            INSERT INTO quotation_links (quotation_id, item_reference_id, item_values_id)
            VALUES (?, ?, ?)
        `).run(quotation_id, item_reference_id, item_values_id);
        return row.lastInsertRowid as number;
    };

/** deletar link de cotação via id */
const deleteById = (db: Database) =>
    (quotation_link_id: QuotationLink['id']): void => {
        db.prepare(`
            DELETE FROM quotation_links
            WHERE id = ?
        `).run(quotation_link_id);
    };

/** pega link de cotação pelo id */
const getById = (db: Database) =>
    (quotation_link_id: QuotationLink['id']): QuotationLink | undefined => {
        return db.prepare(`
            SELECT *
            FROM quotation_links
            WHERE id = ?
            LIMIT 1
        `).get(quotation_link_id) as QuotationLink | undefined;
    };

/** pegar todos os links de cotação por id de cotação */
const getAllByQuotationId = (db: Database) =>
    (quotation_id: QuotationLink['quotation_id']): QuotationLink[] => {
        return db.prepare(`
            SELECT *
            FROM quotation_links
            WHERE quotation_id = ?
        `).all(quotation_id) as QuotationLink[];
    };

/** pega o link de cotação pelo item_values_id (cada item_values gera um id novo e único) */
const getByItemValuesId = (db: Database) =>
    (item_values_id: QuotationLink['item_values_id']): QuotationLink | undefined => {
        return db.prepare(`
            SELECT *
            FROM quotation_links
            WHERE item_values_id = ?
            LIMIT 1
        `).get(item_values_id) as QuotationLink | undefined;
    };

/** atualizar link de cotação */
const update = (db: Database) =>
    (id: QuotationLink['id'], data: Partial<QuotationLink>) => {
        const fields: string[] = [];
        const values: unknown[] = [];

        if (data.item_reference_id !== undefined) {
            fields.push("item_reference_id = ?");
            values.push(data.item_reference_id);
        }

        if (data.item_values_id !== undefined) {
            fields.push("item_values_id = ?");
            values.push(data.item_values_id);
        }

        if (!fields.length) return;

        values.push(id);

        db.prepare(`
            UPDATE quotation_links
            SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(...values);

        return getById(db)(id);
    }

const quotationLinksRepository = (db: Database) => {
    return {
        create: create(db),
        getById: getById(db),
        getAllByQuotationId: getAllByQuotationId(db),
        getByItemValuesId: getByItemValuesId(db),
        update: update(db),
        deleteById: deleteById(db)
    }
};

export default quotationLinksRepository;