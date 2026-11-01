import type { RootState } from "@/app/store";

import { pagesData } from "../pages";

export const selectIsSidebarCollapsed = (state: RootState) =>
    state.layout.isSidebarCollapsed;

export const activePage = (state: RootState) =>
    state.layout.activePage;

export const activePageData = (state: RootState) => {
    const activePageId = state.layout.activePage;
    return pagesData.find((page) => page.id === activePageId);
}