// utils
import { failure, success } from "../../utils/handleSuccess.js";
import validateItemReference from "../item/validateItemReference.js";

type MatchedItem = UpdateQuotation["items"][number] & {
    quotation_link_id: number;
};

type CurrentQuotationLink = Pick<QuotationLink, "id" | "item_reference_id" | "item_values_id">;

type ItemReferenceDecision =
    | {
        quotation_link_id: number;
        item_values_id: number;
        action: "keep-current";
        item_reference_id: number;
    }
    | {
        quotation_link_id: number;
        item_values_id: number;
        action: "use-existing";
        item_reference_id: number;
    }
    | {
        quotation_link_id: number;
        item_values_id: number;
        action: "create-new";
        item_reference: Omit<ItemReference, "id" | "created_at" | "updated_at">;
        reference_links: Pick<ReferenceLink, "content">[];
    };

export interface CompareItemsReferenceInput {
    matchedItems: MatchedItem[];
    currentQuotationLinks: CurrentQuotationLink[];
    existingItemReferences: ItemReference[];
}

export const rulesCode = {
    QUOTATION_LINK_NOT_FOUND: (id: number) => `O vínculo da cotação ${id} não foi encontrado entre os vínculos atuais.`,
    CURRENT_ITEM_REFERENCE_ID_INVALID: (id: number) => `O vínculo da cotação ${id} possui uma referência atual inválida.`,
    ITEM_REFERENCE_NOT_FOUND: (id: number) => `A referência do item ${id} não foi encontrada.`,
};

/**  */
const compareItemsReference = ({
    matchedItems,
    currentQuotationLinks,
    existingItemReferences,
}: CompareItemsReferenceInput) => {
    const linksById = new Map<number, CurrentQuotationLink>();

    // criar um mapa de vínculos (quotation_link) atuais para validação rápida
    for (const link of currentQuotationLinks) {
        if (typeof link.id === "number" && Number.isSafeInteger(link.id) && link.id > 0) {
            linksById.set(link.id, link);
        }
    }

    const referencesById = new Map<number, ItemReference>();

    // criar um mapa de referências de itens existentes para validação rápida
    for (const reference of existingItemReferences) {
        if (typeof reference.id === "number" && Number.isSafeInteger(reference.id) && reference.id > 0) {
            referencesById.set(reference.id, reference);
        }
    }

    const decisions: ItemReferenceDecision[] = [];

    for (const item of matchedItems) {
        const quotationLinkId = item.quotation_link_id;

        const currentLink = linksById.get(quotationLinkId);

        // valida se o vínculo da cotação (quotation_link) existe entre os vínculos atuais
        if (!currentLink) {
            return failure(rulesCode.QUOTATION_LINK_NOT_FOUND(quotationLinkId));
        }

        // valida se o vínculo da cotação possui um ID de referência de item válido
        const currentReferenceId = currentLink.item_reference_id;
        if (!Number.isSafeInteger(currentReferenceId) || currentReferenceId <= 0) {
            return failure(rulesCode.CURRENT_ITEM_REFERENCE_ID_INVALID(quotationLinkId));
        }

        // valida a referência do item enviada, verificando se é uma referência existente (com ID) ou nova (sem ID)
        const validation = validateItemReference({ itemReference: item.item_reference });
        if (!validation.success) {
            return validation;
        }

        if (validation.data.type === "existing") {
            if (!referencesById.has(validation.data.id)) {
                return failure(rulesCode.ITEM_REFERENCE_NOT_FOUND(validation.data.id));
            }
             
            // se a referência do item enviada é uma referência existente, decide se mantém a referência atual ou usa a referência existente enviada
            decisions.push(validation.data.id === currentReferenceId // se a referência existente enviada é a mesma que a referência atual, mantém a referência atual; caso contrário, usa a referência existente enviada
                ? {
                    quotation_link_id: quotationLinkId,
                    item_values_id: currentLink.item_values_id,
                    action: "keep-current",
                    item_reference_id: currentReferenceId,
                }
                : {
                    quotation_link_id: quotationLinkId,
                    item_values_id: currentLink.item_values_id,
                    action: "use-existing",
                    item_reference_id: validation.data.id,
                });
                
            continue;
        }

        const referenceLinks = (item.reference_links ?? [])
            .map((link) => ({ content: (link.content ?? "").trim() }))
            .filter((link) => link.content.length > 0);

        decisions.push({
            quotation_link_id: quotationLinkId,
            item_values_id: currentLink.item_values_id,
            action: "create-new",
            item_reference: validation.data.data,
            reference_links: referenceLinks,
        });
    }

    return success({ decisions });
};

export default compareItemsReference;