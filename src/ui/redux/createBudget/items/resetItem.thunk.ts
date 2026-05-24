// redux
import type { AppDispatch } from "../../store";
import { type ItemFormScope, resetItemData } from "./itemFormSlice";
import { resetStep } from "./itemFormStepsSlice";

// lima os dados do formulário de acionar item
const resetItem = (dispatch: AppDispatch, scope: ItemFormScope) => {
    dispatch(resetItemData(scope));
    dispatch(resetStep(scope));
};

export default resetItem;