// components
import CurrencyInput from "@/shared/inputs/CurrencyInput";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setValuesField, type ItemFormScope } from "../../../store/itemForm.slice";

const PurchaseShipping = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useAppDispatch();
    const value = useAppSelector((state) => state.itemForm.form[scope].item_values.purchase_shipping);

    return (
        <CurrencyInput
            width={"25%"}
            value={value}
            onValueChange={(value) =>
                dispatch(setValuesField({ scope, key: "purchase_shipping", value }))
            }
            label="Frete de compra"
            placeholder="(opcional)"
        />
    )
}

export default PurchaseShipping;