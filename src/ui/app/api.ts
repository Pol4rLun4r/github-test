// redux
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export type IpcError = {
    status: "CUSTOM_ERROR";
    error: string;
    code?: string;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: fakeBaseQuery<IpcError>(),
    tagTypes: ["QuotationSummary", "QuotationFull", "Items"],
    endpoints: () => ({}),
});