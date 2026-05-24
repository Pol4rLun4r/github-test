import { combineReducers } from "@reduxjs/toolkit";
import tabSlice from "./tabSlice";
import collapsedSlice from "./collapsedSlice";

const sidebarReducer = combineReducers({
    tab: tabSlice,
    collapsed: collapsedSlice,
});

export default sidebarReducer;
