// components
import CurrencyInput from "./CurrencyInput";

// utils
import { ItemFormScope } from "../../../../../redux/createBudget/items/itemFormSlice";

const PurchaseShipping = ({ scope }: { scope: ItemFormScope }) => {
    return (
        <CurrencyInput
            itemVersionInput="purchase_shipping"
            label="Frete de compra"
            placeholder="(opcional)"
            scope={scope}
        />
    )
}

export default PurchaseShipping;