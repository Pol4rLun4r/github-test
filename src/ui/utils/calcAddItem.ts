// utils
import { convertMarkupValue } from "./markupList";

interface CalAddItem extends Partial<ItemValues> {
    switchStMode?: boolean
}

const calcAddItem = ({ ipi = 0, markup = "", purchase_shipping = 0, quantity = 0, st = 0, unit_price = 0, extra_value = 0, switchStMode }: CalAddItem) => {
    // converte markup em um numero
    const markupNum = convertMarkupValue(markup);

    // total do orçamento sem impostos ou qualquer outro valor extra
    const totalWithoutTaxes = quantity * unit_price;

    // IPI em porcentagem convertido em real, calculado com base no valor do item
    const ipiValue = ipi !== 0 ? totalWithoutTaxes * (ipi / 100) : 0;

    // total do orçamento com IPI
    const totalWithIPI = ipiValue + totalWithoutTaxes;

    // ST convertido em real caso necessário
    const stValue = !switchStMode ? st : st !== 0 ? totalWithIPI * (st / 100) : 0;

    // total do orçamento com IPI e ST
    const totalWithIPIandST = totalWithIPI + stValue;

    // markup calculado com base no valor do item
    const markupValue = markupNum !== 0 ? totalWithIPIandST * (markupNum / 100) : 0;

    // markup unitário do item
    const markupUnitValue = markupValue / quantity;

    // orçamento com todos os impostos e valores extras
    const totalWithAll = markupValue + totalWithIPIandST + purchase_shipping + extra_value;

    // valor unitário com todos os cálculos
    const finalUnitValue = totalWithAll / quantity;

    return { totalWithoutTaxes, ipiValue, stValue, totalWithIPIandST, markupValue, markupUnitValue, totalWithAll, finalUnitValue };
};

export default calcAddItem;