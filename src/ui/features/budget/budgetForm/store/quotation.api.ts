import { api } from "@/app/api";

export const quotationApi = api.injectEndpoints({
    endpoints: (build) => ({
        getQuotationSummaries: build.query<Quotation[] | undefined, void>({
            async queryFn() {
                const result = await window.api.quotation.getAllSummary();

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            providesTags: ["QuotationSummary", "Items"],
        }),
        getFullQuotation: build.query<QuotationFull | undefined, Quotation["id"]>({
            async queryFn(quotationId) {
                const result = await window.api.quotation.getFull(quotationId);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            providesTags: (_result, _error, quotationId) => [
                "Items",
                { type: "QuotationFull", id: quotationId },
            ],
        }),
        getQuotationByItemValuesId: build.query<QuotationFull, ItemValues["id"]>({
            async queryFn(itemValuesId) {
                const result = await window.api.quotation.getByItemValuesId(itemValuesId);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            providesTags: ["Items"],
        }),
        createQuotation: build.mutation<QuotationLink[] | undefined, CreateQuotation>({
            async queryFn(quotation) {
                const result = await window.api.quotation.create(quotation);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            invalidatesTags: ["QuotationSummary", "QuotationFull", "Items"],
        }),
        updateQuotation: build.mutation<QuotationFull | undefined, UpdateQuotation>({
            async queryFn(quotation) {
                const result = await window.api.quotation.update(quotation);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
            invalidatesTags: (_result, _error, { quotation }) => [
                "QuotationSummary",
                "Items",
                { type: "QuotationFull", id: quotation.id },
            ],
        }),
    }),
});

export const {
    useGetQuotationSummariesQuery,
    useLazyGetQuotationByItemValuesIdQuery,
} = quotationApi;
