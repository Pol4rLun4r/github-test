import { Database } from "better-sqlite3";

/**  busca item_values pelo id */
const getById = (db: Database) =>
    (item_values_id: number): ItemValues | undefined => {
        const itemValues = db.prepare(`
            SELECT * FROM item_values WHERE id = ? LIMIT 1
        `).get(item_values_id) as ItemValues | undefined;

        return itemValues;
    };

/** busca item_values pelos ids e retorna um array de objetos */
const getByIds = (db: Database) =>
    (item_values_ids: number[]): ItemValues[] => {
        if (item_values_ids.length === 0) return [];

        const placeholders = item_values_ids.map(() => "?").join(", ");
        return db.prepare(`
            SELECT * FROM item_values WHERE id IN (${placeholders})
        `).all(...item_values_ids) as ItemValues[];
    };

/** deleta item_values pelo id */
const deleteById = (db: Database) =>
    (item_values_id: number): void => {
        db.prepare(`
            DELETE FROM item_values
            WHERE id = ?
        `).run(item_values_id);
    }

/**  busca todos os values do item pelo id */
const getAllByReferenceId = (db: Database) =>
    (item_reference_id: number): ItemValues[] => {
        const values = db.prepare(`
            SELECT *
            FROM item_values
            WHERE item_reference_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 5
        `).all(item_reference_id) as ItemValues[];

        return values;
    };

/** busca o registro mais recente dos valores de um item */
const getLatestByReferenceId = (db: Database) =>
    (item_reference_id: number): ItemValues | undefined => {
        return db.prepare(`
            SELECT *
            FROM item_values
            WHERE item_reference_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 1
        `).get(item_reference_id) as ItemValues | undefined;
    };

/** conta todos os registros de valores associados ao item */
const countByReferenceId = (db: Database) =>
    (item_reference_id: number): number => {
        const result = db.prepare(`
            SELECT COUNT(*) AS count
            FROM item_values
            WHERE item_reference_id = ?
        `).get(item_reference_id) as { count: number };

        return result.count;
    };


/** cria um item_value */
const create = (db: Database) =>
    (item_reference_id: number, data: Omit<ItemValues, "id" | "item_reference_id" | "created_at" | "updated_at">): number => {
        const row = db.prepare(`
            INSERT INTO item_values (item_reference_id, position, quantity, unit_price, markup, purchase_shipping, ipi, st, extra_value, boarding, delivery)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            item_reference_id,
            data.position,
            data.quantity ?? 1,
            data.unit_price ?? undefined,
            data.markup ?? undefined,
            data.purchase_shipping ?? undefined,
            data.ipi ?? undefined,
            data.st ?? undefined,
            data.extra_value ?? undefined,
            data.boarding ?? undefined,
            data.delivery ?? undefined
        );
        return row.lastInsertRowid as number;
    };

/** atualiza um item_value */
const update = (db: Database) => (id: ItemValues['id'], data: Partial<ItemValues>) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.item_reference_id !== undefined) {
        fields.push("item_reference_id = ?");
        values.push(data.item_reference_id);
    }

    if (data.position !== undefined) {
        fields.push("position = ?");
        values.push(data.position);
    }

    if (data.quantity !== undefined) {
        fields.push("quantity = ?");
        values.push(data.quantity);
    }

    if (data.unit_price !== undefined) {
        fields.push("unit_price = ?");
        values.push(data.unit_price);
    }

    if (data.markup !== undefined) {
        fields.push("markup = ?");
        values.push(data.markup);
    }

    if (data.purchase_shipping !== undefined) {
        fields.push("purchase_shipping = ?");
        values.push(data.purchase_shipping);
    }

    if (data.ipi !== undefined) {
        fields.push("ipi = ?");
        values.push(data.ipi);
    }

    if (data.st !== undefined) {
        fields.push("st = ?");
        values.push(data.st);
    }

    if (data.extra_value !== undefined) {
        fields.push("extra_value = ?");
        values.push(data.extra_value);
    }

    if (data.boarding !== undefined) {
        fields.push("boarding = ?");
        values.push(data.boarding);
    }

    if (data.delivery !== undefined) {
        fields.push("delivery = ?");
        values.push(data.delivery);
    }

    if (!fields.length) return;

    values.push(id);

    db.prepare(`
      UPDATE item_values
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(...values);

    return getById(db)(id!);
}

const itemValuesRepository = (db: Database) => {
    return {
        getById: getById(db),
        getByIds: getByIds(db),
        getAllByReferenceId: getAllByReferenceId(db),
        getLatestByReferenceId: getLatestByReferenceId(db),
        countByReferenceId: countByReferenceId(db),
        create: create(db),
        update: update(db),
        deleteById: deleteById(db)
    };
};

export default itemValuesRepository;