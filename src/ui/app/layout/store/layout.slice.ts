// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import type { PageId } from "../pages";

interface LayoutState {
    isSidebarCollapsed: boolean;
    activePage: PageId;
}

const initialState: LayoutState = {
    isSidebarCollapsed: true,
    activePage: "create-budget"
};

const layoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        },
        setActivePage: (state, action: PayloadAction<PageId>) => {
            state.activePage = action.payload;
        }
    },
});

export const { toggleSidebar, setActivePage } = layoutSlice.actions;
export default layoutSlice.reducer;
