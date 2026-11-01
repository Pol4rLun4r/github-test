import createTestContext from "../createTestContext.js";
import makeCreateQuotation from "../makeCreateQuotation.js";

/** cria cotação para teste, usando o serviço de criação de cotações */
const createQuotationForTest = (
    context: ReturnType<typeof createTestContext>,
    payload: CreateQuotation = makeCreateQuotation()
) => {
    const result = context.services.quotation.create(payload);

    if (!result.success) {
        throw new Error(result.data);
    }

    return result.data;
}

export default createQuotationForTest;