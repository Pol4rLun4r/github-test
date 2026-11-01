import { failure, success } from "../../utils/handleSuccess.js";

export interface UpdateItemReferenceRulesInput {
    payload: UpdateItemReferencePayload;
    itemReferenceExists: boolean;
    existingReferenceLinks: ReferenceLink[];
}

export const rulesCode = {
    ITEM_REFERENCE_ID_INVALID: "O ID da referência do item é inválido.",
    ITEM_REFERENCE_NOT_FOUND: (id: number) => `Referência do item com ID ${id} não encontrada.`,
    DESCRIPTION_NOT_INFORMED: "A descrição da referência do item deve ser informada.",
    INVALID_TEXT_FIELD: (field: string) => `O campo ${field} deve ser um texto válido.`,
    REFERENCE_LINKS_INVALID: "A lista de links da referência é inválida.",
    REFERENCE_LINK_ID_INVALID: "Um ID de link da referência é inválido.",
    REFERENCE_LINK_NOT_FOUND: (id: number) =>
        `O link ${id} não pertence à referência do item informada.`,
    DUPLICATE_REFERENCE_LINK_ID: (id: number) => `O link ${id} foi informado mais de uma vez.`,
    REFERENCE_LINK_CONTENT_INVALID: "O conteúdo do link deve ser um texto válido.",
};

const normalizeOptionalText = (value?: string | null) => value?.trim() || null;

const updateItemReference = ({
    payload,
    itemReferenceExists,
    existingReferenceLinks,
}: UpdateItemReferenceRulesInput) => {
    const itemReferenceId = payload.item_reference.id;

    if (!Number.isSafeInteger(itemReferenceId) || itemReferenceId === undefined || itemReferenceId <= 0) {
        return failure(rulesCode.ITEM_REFERENCE_ID_INVALID);
    }

    if (!itemReferenceExists) {
        return failure(rulesCode.ITEM_REFERENCE_NOT_FOUND(itemReferenceId));
    }

    const { description } = payload.item_reference;
    if (typeof description !== "string" || !description.trim()) {
        return failure(rulesCode.DESCRIPTION_NOT_INFORMED);
    }

    const optionalFields = {
        internal_code: payload.item_reference.internal_code,
        manufacturer_code: payload.item_reference.manufacturer_code,
        ncm: payload.item_reference.ncm,
        notes: payload.item_reference.notes,
    };

    for (const [field, value] of Object.entries(optionalFields)) {
        if (value !== undefined && value !== null && typeof value !== "string") {
            return failure(rulesCode.INVALID_TEXT_FIELD(field));
        }
    }

    if (!Array.isArray(payload.reference_links)) {
        return failure(rulesCode.REFERENCE_LINKS_INVALID);
    }

    const existingLinksById = new Map(
        existingReferenceLinks.map((link) => [link.id, link]),
    );
    const seenLinkIds = new Set<number>();
    const referenceLinks: UpdateItemReferencePayload["reference_links"] = [];

    for (const link of payload.reference_links) {
        if (link.id !== undefined) {
            if (!Number.isSafeInteger(link.id) || link.id <= 0) {
                return failure(rulesCode.REFERENCE_LINK_ID_INVALID);
            }

            if (seenLinkIds.has(link.id)) {
                return failure(rulesCode.DUPLICATE_REFERENCE_LINK_ID(link.id));
            }
            seenLinkIds.add(link.id);

            if (!existingLinksById.has(link.id)) {
                return failure(rulesCode.REFERENCE_LINK_NOT_FOUND(link.id));
            }
        }

        if (typeof link.content !== "string") {
            return failure(rulesCode.REFERENCE_LINK_CONTENT_INVALID);
        }

        const content = link.content.trim();
        if (content) {
            referenceLinks.push({
                ...(link.id === undefined ? {} : { id: link.id }),
                content,
            });
        }
    }

    return success<UpdateItemReferencePayload>({
        item_reference: {
            id: itemReferenceId,
            description: description.trim(),
            internal_code: normalizeOptionalText(payload.item_reference.internal_code),
            manufacturer_code: normalizeOptionalText(payload.item_reference.manufacturer_code),
            ncm: normalizeOptionalText(payload.item_reference.ncm),
            notes: normalizeOptionalText(payload.item_reference.notes),
        },
        reference_links: referenceLinks,
    });
};

export default updateItemReference;
