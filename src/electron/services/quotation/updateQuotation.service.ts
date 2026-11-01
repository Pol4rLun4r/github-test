// database
import type { Database } from "better-sqlite3";

// rules
import { createRules } from "../../rules/index.js";

// utils
import { success } from "../../utils/handleSuccess.js";
import helpers from "../../utils/helpers.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

/** atualizar cotação (completa) */
const updateQuotation = (db: Database) => {
    const repo = createRepositories(db);
    const rules = createRules();

    return db.transaction((payload: UpdateQuotation) => {
        const currentQuotation = repo.quotation.base.getById(payload.quotation.id);

        // ================================= validação da cotação base =================================

        // validar regras para atualizar cotação (cotação base)
        const validateQuotation = rules.quotation.updateBase({
            id: payload.quotation.id,
            status: payload.quotation.status,
            notes: payload.quotation.notes,
            amount: payload.quotation.amount,
            total_value: payload.quotation.total_value,
            itemsCount: payload.items.length,
            quotationExists: currentQuotation !== undefined ? true : false,
        });

        // quotation errors
        if (!validateQuotation.success) {
            return validateQuotation;
        };

        const payloadQuotation = validateQuotation.data;
        const quotationChanges: Partial<Pick<Quotation, "status" | "notes" | "amount" | "total_value">> = {};

        // verificar se houve alterações na cotação base
        if (currentQuotation!.status !== payloadQuotation.status) quotationChanges.status = payloadQuotation.status;
        if (currentQuotation!.notes !== payloadQuotation.notes) quotationChanges.notes = payloadQuotation.notes;
        if (currentQuotation!.amount !== payloadQuotation.amount) quotationChanges.amount = payloadQuotation.amount;
        if (currentQuotation!.total_value !== payloadQuotation.total_value) quotationChanges.total_value = payloadQuotation.total_value;

        // ================================= validação do quotation_link =================================

        // pega todos os quotation_link da cotação atual
        const currentLinks = repo.quotation.links.getAllByQuotationId(payloadQuotation.id);

        // comparar os quotation_link atuais com os enviados no payload
        const validateQuotationLink = rules.quotation_link.validateQuotationLink({
            currentQuotationLinkIds: currentLinks.map(link => link.id!),
            items: payload.items,
        });

        if (!validateQuotationLink.success) {
            return validateQuotationLink;
        }

        // retorna os quotation_link que foram adicionados, removidos ou que permaneceram na cotação
        const { added, removed, matched } = validateQuotationLink.data;

        // ================================= validação para adicionar novos itens =================================

        // pega os ids das referências dos itens adicionados, removendo duplicatas e filtrando apenas os ids válidos
        const requestedReferenceIds = [...new Set(
            [...added, ...matched]
                .map((item) => item.item_reference.id) // retorna apenas os ids
                .filter(helpers.isValidPositiveInteger), // retorna apenas números inteiros validos
        )];

        // pega os dados das referências dos itens adicionados que já existem no banco de dados
        const existingItemReferences = repo.item.reference.getByIds(requestedReferenceIds);

        // validar os itens adicionados
        const validateAddedItems = rules.quotation_link.validateAddedItems({
            addedItems: added,
            allItems: payload.items,
            existingItemReferences,
        });

        if (!validateAddedItems.success) {
            return validateAddedItems;
        }

        // ================================= validação para deletar itens =================================

        const validateRemovedItems = rules.quotation_link.validateRemovedItems({
            removedQuotationLinkIds: removed,
            currentQuotationLinks: currentLinks,
        });

        if (!validateRemovedItems.success) {
            return validateRemovedItems;
        }

        const { itemsToRemove } = validateRemovedItems.data;

        // ================================= validar atualização de item_values =================================

        // pega os ids dos item_values adicionados, removendo duplicatas e filtrando apenas os ids válidos
        const requestedValuesIds = [...new Set(
            [...added, ...matched]
                .map((item) => item.item_values.id) // retorna apenas os ids
                .filter(helpers.isValidPositiveInteger), // retorna apenas números inteiros validos
        )];

        // pega os dados das referências dos itens adicionados que já existem no banco de dados
        const existingItemValues = repo.item.values.getByIds(requestedValuesIds);

        const compareItemsValues = rules.quotation_link.compareItemsValues({
            currentQuotationLinks: currentLinks,
            existingItemValues,
            matchedItems: matched
        })

        if (!compareItemsValues.success) {
            return compareItemsValues
        }

        const itemValuesDecisions = compareItemsValues.data.decisions;

        // ================================= validar atualização de item_values =================================

        const compareItemsReference = rules.quotation_link.compareItemsReference({
            currentQuotationLinks: currentLinks,
            existingItemReferences,
            matchedItems: matched
        })

        if (!compareItemsReference.success) {
            return compareItemsReference
        }

        const itemReferenceDecisions = compareItemsReference.data.decisions;

        // ================================= aplicar modificações ao banco de dados =================================

        // persistir alterações de item_values
        if (itemValuesDecisions.length > 0) {
            for (const itemValue of itemValuesDecisions) {
                if (Object.keys(itemValue.changes).length > 0) {
                    repo.item.values.update(
                        itemValue.item_values_id,
                        { ...itemValue.changes }
                    )
                }
            }
        }

        if (itemReferenceDecisions.length > 0) {
            for (const itemReference of itemReferenceDecisions) {
                if (itemReference.action === "use-existing") {
                    repo.quotation.links.update(
                        itemReference.quotation_link_id,
                        { item_reference_id: itemReference.item_reference_id }
                    )
                    repo.item.values.update(
                        itemReference.item_values_id,
                        { item_reference_id: itemReference.item_reference_id }
                    )
                };

                if (itemReference.action === "create-new") {
                    const newItemReferenceId = repo.item.reference.create({
                        ...itemReference.item_reference,
                    });

                    for (const link of itemReference.reference_links) {
                        repo.item.referenceLinks.create(
                            newItemReferenceId,
                            { content: link.content } as ReferenceLink,
                        );
                    }

                    repo.quotation.links.update(
                        itemReference.quotation_link_id,
                        { item_reference_id: newItemReferenceId }
                    )
                    repo.item.values.update(
                        itemReference.item_values_id,
                        { item_reference_id: newItemReferenceId }
                    )
                }

                // se a ação for "keep-current", não é necessário fazer nada, pois a referência do item atual será mantida
                continue
            }
        }

        // apagar os vínculos/linhas (quotation_links) da cotação que foram removidos
        if (itemsToRemove.length > 0) {
            for (const item of itemsToRemove) {
                repo.quotation.links.deleteById(item.quotation_link_id);
                repo.item.values.deleteById(item.item_values_id);
            }
        }

        // persistir os novos itens validados no banco de dados
        if (validateAddedItems.data.items.length > 0) {
            repo.workFlows.addItemToQuotation(
                payloadQuotation.id,
                validateAddedItems.data.items,
            );
        }

        // persistir os dados da cotação base somente depois de validar as linhas.
        if (Object.keys(quotationChanges).length !== 0) {
            repo.quotation.base.update({ id: currentQuotation!.id, ...quotationChanges });
        }

        // força atualizar a data de update da cotação
        repo.quotation.base.update({ id: currentQuotation!.id, ...{} });

        return success(repo.workFlows.getQuotationFull(payloadQuotation.id));
    });
};

export default updateQuotation;