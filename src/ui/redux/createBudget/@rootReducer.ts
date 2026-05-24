import { combineReducers } from "@reduxjs/toolkit";

// slicers
import itemFormSlice from "./items/itemFormSlice";
import ReferenceLinkFormSlice from "./items/ReferenceLinkFormSlice";
import itemFormSwitchModeSlice from "./items/itemFormSwitchModeSlice";
import clientSlice from './clientSlice';
import itemFormStepsSlice from './items/itemFormStepsSlice';
import listItemsSlice from "./items/listItemsSlice";
import listItemsSwitchModeSlice from "./items/listItemsSwitchModeSlice";
import quotationSlice from './quotationSlice';

const createBudgetReducer = combineReducers({
    client: clientSlice,
    quotation: quotationSlice,
    itemForm: itemFormSlice,
    referenceLinkForm: ReferenceLinkFormSlice,
    itemFormSteps: itemFormStepsSlice,
    itemFormSwitchMode: itemFormSwitchModeSlice,
    listItems: listItemsSlice,
    listItemsSwitchMode: listItemsSwitchModeSlice,
});

export default createBudgetReducer;
