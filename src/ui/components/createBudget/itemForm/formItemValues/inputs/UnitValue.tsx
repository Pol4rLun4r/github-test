// components
import CurrencyInput from "./CurrencyInput";

// utils
import { ItemFormScope } from "../../../../../redux/createBudget/items/itemFormSlice";

const UnitValue = ({ scope }: { scope: ItemFormScope }) => {
    return (
        <CurrencyInput
            itemVersionInput="unit_price"
            label="Valor unitário"
            placeholder="00"
            withAsterisk
            scope={scope}
            widthInput={"30%"}
        />
    )
}

export default UnitValue
