import { Database } from "better-sqlite3";
import { createRepositories } from "../index.js";

const getReferenceLinksFromItem = (item: QuotationItemToAdd): Pick<ReferenceLink, "content">[] => {
    return (item.reference_links ?? [])
        .map((link) => ({ content: (link.content ?? "").trim() }))
        .filter((link) => link.content.length > 0);
};

const addItemToQuotationRepository = (db: Database) =>
    (quotationId: number, items: QuotationItemToAdd[]): QuotationLink[] => {
        const repo = createRepositories(db);

        const run = db.transaction(() => {
            const results: QuotationLink[] = [];

            for (const item of items) {
                const itemReference = item.item_reference;
                const itemValues = item.item_values;

                // if para determinar se um item precisa ser criado ou não, baseado se tem um id
                let itemReferenceId: number
                let shouldCreateReferenceLinks = false;

                if (itemReference.id) {
                    // informar apenas o id caso o item possua o mesmo
                    itemReferenceId = itemReference.id
                } else {
                    // criar item caso o não exista um id
                    itemReferenceId = repo.item.reference.create(itemReference)
                    shouldCreateReferenceLinks = true;
                }

                const referenceLinks = getReferenceLinksFromItem(item);

                // Só cria links quando a referência é nova.
                // Se item_reference.id foi informado, a referência já existe e não deve receber novos links aqui.
                if (shouldCreateReferenceLinks && referenceLinks.length) {
                    for (const link of referenceLinks) {
                        repo.item.referenceLinks.create(itemReferenceId, {item_reference_id: itemReferenceId, content: link.content});
                    }
                }

                // cria e pega o id do item_values
                const itemValuesId = repo.item.values.create(itemReferenceId, itemValues);


                // cria e pega o id do quotation_link
                const linkId = repo.quotation.links.create(quotationId, itemReferenceId, itemValuesId);

                // pega os dados do quotation_link
                const getLinkData = repo.quotation.links.getById(linkId);

                // insere os dados do quotation_link em cada "for" em results
                results.push(getLinkData!);
            }

            return results;
        });

        return run();
    }

    export default addItemToQuotationRepository;