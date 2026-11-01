// types
import type { RootState } from "@/app/store";
import { ItemFormScope } from "./itemForm.slice";
import type { BudgetFormScope } from "../../budgetForm/store/@rootReducer";

// utils
import { isDefinedMarkup, isDefinedNonNegative } from "@/utils/itemFormValidation";
import { hasItemChanged } from "@/utils/budgetComparison";

// pega todo os dados do itemForm (formulário do item)
export const getItemFormState = (state: RootState, scope: ItemFormScope) =>
    state.itemForm.form[scope];

export const getSwitchModeReferenceForm = (state: RootState) =>
    state.itemForm.switch.item_reference.mode;

export const getSwitchModeValuesForm = (state: RootState) =>
    state.itemForm.switch.item_values.mode;

export const getStepState = (state: RootState, scope: ItemFormScope) =>
    state.itemForm.steps[scope].step

export const isHiddenValueWarning = (state: RootState, scope: ItemFormScope) => {
    const step = state.itemForm.steps[scope].step;
    const itemValues = state.itemForm.form[scope].item_values;
    const switchMode = state.itemForm.switch.item_values.mode;

    return Boolean(itemValues.ipi || itemValues.st || itemValues.extra_value)
        && step !== 0
        && switchMode;
};

export const isHasDescription = (state: RootState, scope: ItemFormScope) => {
    return state.itemForm.form[scope].item_reference.description!.trim().length > 0;
}

export const isHasNotes = (state: RootState, scope: ItemFormScope) => {
    const notes = state.itemForm.form[scope].item_reference.notes;
    const hasNotes = notes === null ? false : notes === undefined ? false : notes?.length <= 0 ? false : true;

    return hasNotes
}

export const isHasItemReferenceId = (state: RootState, scope: ItemFormScope) => {
    const itemReferenceId = state.itemForm.form[scope].item_reference.id;

    return itemReferenceId !== undefined && itemReferenceId !== null;
};

export const isCanSubmitItemForm = (
    state: RootState,
    scope: ItemFormScope,
    budgetScope: BudgetFormScope,
) => {
    const item = getItemFormState(state, scope);
    const { item_reference, item_values } = item;
    const isValid = Boolean(item_reference.description?.trim()) &&
        isDefinedNonNegative(item_values.quantity) &&
        isDefinedMarkup(item_values.markup);

    if (!isValid) return false;
    if (scope !== "item_form_edit") return true;

    const originalItem = state.budgetForm.itemTable[budgetScope]
        .find(({ temp_id }) => temp_id === item.temp_id);

    return originalItem !== undefined && hasItemChanged(originalItem, item);
};