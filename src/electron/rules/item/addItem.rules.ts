import { success, failure } from "../../utils/handleSuccess.js";

export interface AddItemRules {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quotationVersionExists: any | undefined;
    quotation_version_id: number;
    items: ItemData[];
};

const addItemsToQuotationRules = ({ quotation_version_id, items, quotationVersionExists, }: AddItemRules) => {
    // verifica se a cotação existe
    if (!quotationVersionExists) {
        return failure("Versão da cotação não existe");
    }

    // verifica se o array não é vazio
    if (!items?.length) {
        return failure("Informe ao menos um item");
    }

    // items validados
    const validItems: ItemData[] = [];

    // validar cada item
    for (const item of items) {

        // separa os dados básicos, valores e links do item para melhor manejo
        const { item_reference, item_version, reference_links: itemReferenceLinks } = item;

        // validar ordem/posição e se os items tem a mesma posição
        const position = item_version.position;

        if (position === undefined) {
            return failure("Cada item deve ter uma posição/ordem");
        } else {
            // checar se tem outro item com a mesma posição usando filter + length, caso tenha mais de 1 item com a mesma posição, retorna erro;
            const hasSamePosition = items.filter((item) => item.item_version.position === position).length;
            if(hasSamePosition > 1) return failure(`${hasSamePosition} items tem o mesmo numero de posição: ${position}`);
        }

        // validar descrição
        const description = (item_reference.description ?? "").trim();

        // checar se descrição não está vazia
        if (!description) {
            return failure("Cada item deve ter uma descrição");
        }

        const notes = (item_reference.notes ?? "").trim();

        // validar quantidade
        const quantity = item_version.quantity ?? 1;

        // valida os links de referência se existirem
        const reference_links = itemReferenceLinks
            ?.map((link: Partial<ReferenceLink>) => ({
                content: (link.content ?? "").trim(),
            }))
            .filter((link) => link.content.length > 0) as ReferenceLink[];

        validItems.push({
            item_reference: {
                ...item_reference,
                description,
                notes: notes.length !== 0 ? notes : undefined,
            },
            item_version: { ...item_version, quantity },
            reference_links: reference_links ?? [],
        });
    }

    return success({
        quotation_version_id,
        items: validItems,
    });
};

export default addItemsToQuotationRules;
