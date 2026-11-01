import { Database } from "better-sqlite3";

/** cria um link de referência para um item */
export const create = (db: Database) =>
    (item_reference_id: number, data: ReferenceLink): number => {
        const row = db.prepare(`
            INSERT INTO reference_links (item_reference_id, content)
            VALUES (?, ?)
        `).run(item_reference_id, data.content);
        return row.lastInsertRowid as number;
    };

/** pega os links de referência por ID da referência do item */
export const getByReferenceId = (db: Database) =>
    (item_reference_id: number): ReferenceLink[] => {
        return db.prepare(`
            SELECT
                id,
                item_reference_id,
                content,
                datetime(created_at, 'localtime') AS created_at
            FROM reference_links
            WHERE item_reference_id = ?
            ORDER BY id ASC
        `).all(item_reference_id) as ReferenceLink[];
    };

const updateContentForReference = (db: Database) =>
    (itemReferenceId: number, linkId: number, content: string): void => {
        db.prepare(`
            UPDATE reference_links
            SET content = ?
            WHERE id = ? AND item_reference_id = ?
        `).run(content, linkId, itemReferenceId);
    };

const deleteByIdForReference = (db: Database) =>
    (itemReferenceId: number, linkId: number): void => {
        db.prepare(`
            DELETE FROM reference_links
            WHERE id = ? AND item_reference_id = ?
        `).run(linkId, itemReferenceId);
    };

const replaceForReference = (db: Database) => (itemReferenceId: number, links: string[]) => {
    db.prepare(`
      DELETE FROM reference_links
      WHERE item_reference_id = ?
    `).run(itemReferenceId);

    for (const content of links) {
        const normalized = content.trim();
        if (!normalized) continue;

        db.prepare(`
        INSERT INTO reference_links (item_reference_id, content)
        VALUES (?, ?)
      `).run(itemReferenceId, normalized);
    }

    return getByReferenceId(db)(itemReferenceId);
}

const referenceLinksRepository = (db: Database) => {
    return {
        getByReferenceId: getByReferenceId(db),
        create: create(db),
        updateContentForReference: updateContentForReference(db),
        deleteByIdForReference: deleteByIdForReference(db),
        replaceForReference: replaceForReference(db)
    };
};

export default referenceLinksRepository;