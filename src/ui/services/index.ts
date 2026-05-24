import clientApi from "./client-api";
import itemApi from "./item-api";
import quotationApi from "./quotation-api";
import windowApi from "./window-api"

const services = {
    item: itemApi,
    client: clientApi,
    quotation: quotationApi,
    window: windowApi
}

export default services;