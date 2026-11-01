// utils
import { failure, success } from "../../utils/handleSuccess.js";

type QuotationItemPayload = UpdateQuotation["items"][number];

type MatchedQuotationItem = QuotationItemPayload & {
    quotation_link_id: number;
};

export interface CompareQuotationItemsInput {
    currentQuotationLinkIds: number[];
    items: QuotationItemPayload[];
}

export const rulesCode = {
    INVALID_QUOTATION_LINK_ID: "O ID do vínculo da cotação é inválido.",
    DUPLICATE_QUOTATION_LINK_ID: (id: number) => `O vínculo da cotação ${id} foi enviado mais de uma vez.`,
    QUOTATION_LINK_NOT_FOUND: (id: number) => `O vínculo da cotação ${id} não pertence a esta cotação.`,
};

/** função para validar os items (sendo quotation_link a representação de cada item) da cotação e filtrar o que deve ser feito com cada item */
const validateQuotationLink = ({ currentQuotationLinkIds, items }: CompareQuotationItemsInput) => {
    const currentIds = new Set(currentQuotationLinkIds); // conjunto de IDs atuais da cotação
    const receivedIds = new Set<number>(); // conjunto de IDs recebidos no payload
    const added: QuotationItemPayload[] = []; // representa os itens que são novos e não possuem um vínculo com a cotação atual
    const matched: MatchedQuotationItem[] = []; // representa os itens que são validos e correspondem a uma linha existente na cotação

    for (const item of items) {
        const id = item.quotation_link_id;
        
        // se o id não foi informado, é uma linha nova na cotação
        if (id === undefined) {
            added.push(item);
            continue;
        }

        // validar se o id é um número inteiro positivo
        if (!Number.isSafeInteger(id) || id <= 0) {
            return failure(rulesCode.INVALID_QUOTATION_LINK_ID);
        }

        // validar se o id é duplicado ou não pertence à cotação atual (ao usar receivedIds.add(id) depois da validação, garantimos que o id não será adicionado ao conjunto de IDs recebidos se for inválido ou duplicado)
        if (receivedIds.has(id)) {
            return failure(rulesCode.DUPLICATE_QUOTATION_LINK_ID(id));
        }

        // validar se o id pertence à cotação atual
        if (!currentIds.has(id)) {
            return failure(rulesCode.QUOTATION_LINK_NOT_FOUND(id));
        }

        receivedIds.add(id);
        matched.push(item as MatchedQuotationItem); // adiciona o item à lista de itens correspondentes
    }

    const removed = currentQuotationLinkIds.filter((id) => !receivedIds.has(id)); // caso o id não esteja presente no payload, significa que a linha foi removida da cotação

    return success({ added, removed, matched });
};

export default validateQuotationLink;