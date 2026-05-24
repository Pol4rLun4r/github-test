// utils
import { convertMarkupValue } from "./markupList";

const calcAddItem = ({ ipi = 0, markup = "", purchase_shipping = 0, quantity = 0, st = 0, unit_price = 0, extra_value = 0 }: Partial<ItemVersion>) => {
    const markupNum = convertMarkupValue(markup);

    const totalWithoutTaxes = quantity * unit_price;
    const ipiValue = ipi !== 0 ? totalWithoutTaxes * (ipi / 100) : 0;
    const totalWithIPI = ipiValue + totalWithoutTaxes;
    const totalWithIPIandST = totalWithIPI + st;
    const markupValue = markupNum !== 0 ? totalWithIPIandST * (markupNum / 100) : 0;
    const markupUnitValue = markupValue / quantity;
    const totalWithAll = markupValue + totalWithIPIandST + purchase_shipping + extra_value;
    const finalUnitValue = totalWithAll / quantity;

    return { totalWithoutTaxes, ipiValue, totalWithIPIandST, markupValue, markupUnitValue, totalWithAll, finalUnitValue };
};

export default calcAddItem;