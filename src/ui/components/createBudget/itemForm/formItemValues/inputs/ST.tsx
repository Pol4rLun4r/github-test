// components
import CurrencyInput from "./CurrencyInput";

// utils
import { ItemFormScope } from "../../../../../redux/createBudget/items/itemFormSlice";

const ST = ({ scope }: { scope: ItemFormScope }) => {
    return (
        <CurrencyInput
            itemVersionInput="st"
            label="ST"
            placeholder="(opcional)"
            scope={scope}
        />
    )
}

export default ST;