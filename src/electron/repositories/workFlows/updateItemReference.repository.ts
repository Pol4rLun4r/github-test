import type { Database } from "better-sqlite3";
import { createRepositories } from "../index.js";

const updateItemReferenceRepository = (db: Database) =>
    (payload: UpdateItemReferencePayload): ItemWithReferenceLinks | undefined => {
        const repo = createRepositories(db);
        const run = db.transaction(() => {
            const itemReferenceId = payload.item_reference.id;
            if (itemReferenceId === undefined) return undefined;

            const currentReference = repo.item.reference.getById(itemReferenceId);
            if (!currentReference) return undefined;

            const currentLinksById = new Map(
                currentReference.reference_links.map((link) => [link.id, link]),
            );
            const requestedLinkIds = new Set(
                payload.reference_links.flatMap((link) =>
                    link.id === undefined || !link.content.trim() ? [] : [link.id],
                ),
            );

            for (const link of currentReference.reference_links) {
                if (link.id !== undefined && !requestedLinkIds.has(link.id)) {
                    repo.item.referenceLinks.deleteByIdForReference(itemReferenceId, link.id);
                }
            }

            for (const link of payload.reference_links) {
                const content = link.content.trim();
                if (!content) continue;

                if (link.id === undefined) {
                    repo.item.referenceLinks.create(itemReferenceId, {
                        item_reference_id: itemReferenceId,
                        content,
                    });
                    continue;
                }

                if (!currentLinksById.has(link.id)) {
                    throw new Error(
                        `O link ${link.id} não pertence à referência do item ${itemReferenceId}.`,
                    );
                }

                repo.item.referenceLinks.updateContentForReference(
                    itemReferenceId,
                    link.id,
                    content,
                );
            }

            repo.item.reference.update(itemReferenceId, {
                description: payload.item_reference.description.trim(),
                internal_code: payload.item_reference.internal_code?.trim() || null,
                manufacturer_code: payload.item_reference.manufacturer_code?.trim() || null,
                ncm: payload.item_reference.ncm?.trim() || null,
                notes: payload.item_reference.notes?.trim() || null,
            });

            return repo.item.reference.getById(itemReferenceId);
        });

        return run();
    };

export default updateItemReferenceRepository;
