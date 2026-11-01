// item rules
import createAndAddItem from "./item/createAndAdd.js";
import searchDescriptionRules from "./item/searchDescription.js";
import findItemReferencesRules from "./item/findItemReferences.js";
import getReferenceLinksRules from "./item/getReferenceLinks.js";
import getAllItemValuesByReferenceIdRules from "./item/getAllItemValuesByReferenceId.js";
import getItemDetailsByReferenceIdRules from "./item/getItemDetailsByReferenceId.js";
import getItemValuesByIdRules from "./item/getItemValuesById.js";
import validateItemReference from "./item/validateItemReference.js";
import validateItemValues from "./item/validateItemValues.js";
import updateItemReference from "./item/updateItemReference.js";

// quotation rules
import createQuotation from "./quotation/create.js";
import getQuotationFullRules from "./quotation/getFull.js";
import updateQuotationBaseRules from "./quotation/updateBase.js";

// quotation links rules
import validateQuotationLink from "./quotationLink/validateQuotationLink.js";
import validateAddedQuotationItems from "./quotationLink/validateAddedItems.js";
import validateRemovedQuotationItems from "./quotationLink/validateRemovedItems.js";
import compareItemsValues from "./quotationLink/compareItemsValues.js";
import compareItemsReference from "./quotationLink/compareItemsReference.js";

export const createRules = () => ({
    quotation: {
        create: createQuotation,
        getFull: getQuotationFullRules,
        updateBase: updateQuotationBaseRules,
    },
    quotation_link: {
        validateQuotationLink: validateQuotationLink,
        validateAddedItems: validateAddedQuotationItems,
        validateRemovedItems: validateRemovedQuotationItems,
        compareItemsValues: compareItemsValues,
        compareItemsReference,
    },
    item: {
        createAndAdd: createAndAddItem,
        searchDescription: searchDescriptionRules,
        findItemReferences: findItemReferencesRules,
        getReferenceLinks: getReferenceLinksRules,
        getAllItemValuesByReferenceId: getAllItemValuesByReferenceIdRules,
        getItemDetailsByReferenceId: getItemDetailsByReferenceIdRules,
        getItemValuesById: getItemValuesByIdRules,
        validateReference: validateItemReference,
        validateValues: validateItemValues,
        updateItemReference,
    }
});

export type Rules = ReturnType<typeof createRules>;