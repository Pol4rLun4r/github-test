// components
import CurrencyInput from "@/shared/inputs/CurrencyInput";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setValuesField, type ItemFormScope } from "../../../store/itemForm.slice";

const ExtraValue = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useAppDispatch();
    const value = useAppSelector((state) => state.itemForm.form[scope].item_values.extra_value);

    return (
        <CurrencyInput
            value={value}
            onValueChange={(value) =>
                dispatch(setValuesField({ scope, key: "extra_value", value }))
            }
            label="Valor extra"
            placeholder="(opcional)"
        />
    )
}

export default ExtraValue
