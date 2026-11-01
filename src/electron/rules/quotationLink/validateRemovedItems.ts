import { failure, success } from "../../utils/handleSuccess.js";

type CurrentQuotationLink = Pick<QuotationLink, "id" | "item_values_id">;

type ItemToRemove = {
    quotation_link_id: number;
    item_values_id: number;
};

export interface ValidateRemovedQuotationItemsInput {
    removedQuotationLinkIds: number[];
    currentQuotationLinks: CurrentQuotationLink[];
}

export const rulesCode = {
    INVALID_QUOTATION_LINK_ID: "O ID do vínculo da cotação é inválido.",
    DUPLICATE_QUOTATION_LINK_ID: (id: number) => `O vínculo da cotação ${id} foi enviado mais de uma vez para remoção.`,
    QUOTATION_LINK_NOT_FOUND: (id: number) => `O vínculo da cotação ${id} não pertence a esta cotação.`,
    INVALID_ITEM_VALUES_ID: (id: number) => `O vínculo da cotação ${id} não possui um ID de valores válido.`,
};

const validateRemovedItems = ({
    removedQuotationLinkIds,
    currentQuotationLinks,
}: ValidateRemovedQuotationItemsInput) => {
    const linksById = new Map<number, CurrentQuotationLink>();

    // criar um mapa de vínculos (quotation_link) atuais para validação rápida
    for (const link of currentQuotationLinks) {
        if (Number.isSafeInteger(link.id) && link.id! > 0) {
            linksById.set(link.id!, link); // adiciona o vínculo ao mapa, usando o ID como chave e o próprio vínculo como valor
        }
    }

    const receivedIds = new Set<number>();
    const itemsToRemove: ItemToRemove[] = [];

    for (const id of removedQuotationLinkIds) {
        // validar se o ID do vínculo (quotation_link) é um número inteiro positivo
        if (!Number.isSafeInteger(id) || id <= 0) {
            return failure(rulesCode.INVALID_QUOTATION_LINK_ID);
        }

        // validar se o ID do vínculo (quotation_link) já foi recebido antes (duplicado)
        if (receivedIds.has(id)) {
            return failure(rulesCode.DUPLICATE_QUOTATION_LINK_ID(id));
        }

        // validar se o vínculo (quotation_link) existe nos vínculos atuais
        const link = linksById.get(id); // pega o vínculo atual correspondente ao ID do vínculo (quotation_link) enviado para remoção
        if (!link) {
            return failure(rulesCode.QUOTATION_LINK_NOT_FOUND(id));
        }

        // validar se o vínculo (quotation_link) possui um item_values_id válido
        if (!Number.isSafeInteger(link.item_values_id) || link.item_values_id <= 0) {
            return failure(rulesCode.INVALID_ITEM_VALUES_ID(id));
        }

        receivedIds.add(id); // adiciona o ID do vínculo (quotation_link) ao conjunto de IDs recebidos para rastrear duplicatas
        itemsToRemove.push({
            quotation_link_id: id,
            item_values_id: link.item_values_id,
        });
    }

    // retorna os itens a serem removidos, contendo o ID do vínculo (quotation_link_id) e o ID dos valores do item (item_values_id)
    return success({ itemsToRemove });
};

export default validateRemovedItems;