import itemApi from "./item-api";
import quotationApi from "./quotation-api";
import windowApi from "./window-api"

const services = {
    item: itemApi,
    quotation: quotationApi,
    window: windowApi
}

export default services;