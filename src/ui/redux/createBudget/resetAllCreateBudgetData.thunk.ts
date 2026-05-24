// redux types
import type { AppDispatch } from "../store";

// redux resets
import { resetClient } from "./clientSlice";
import { resetItemData } from "./items/itemFormSlice";
import { resetStep } from "./items/itemFormStepsSlice";
import { resetReferenceLink } from "./items/ReferenceLinkFormSlice.ts";
import { resetList } from "./items/listItemsSlice";
import { resetQuotation } from "./quotationSlice";

const resetAllCreateBudgetData = (dispatch: AppDispatch) => {
    dispatch(resetItemData('add'));
    dispatch(resetItemData('edit'));
    dispatch(resetStep('add'));
    dispatch(resetStep('edit'));
    dispatch(resetReferenceLink('add'));
    dispatch(resetReferenceLink('edit'));
    dispatch(resetList());
    dispatch(resetClient());
    dispatch(resetQuotation());
};

export default resetAllCreateBudgetData;