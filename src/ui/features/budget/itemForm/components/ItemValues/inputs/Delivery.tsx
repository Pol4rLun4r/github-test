// mantine
import { NumberInput } from "@mantine/core";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, setValuesField } from "../../../store/itemForm.slice";

const Delivery = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useAppDispatch();
    const delivery = useAppSelector((state) => state.itemForm.form[scope].item_values.delivery);

    return (
        <NumberInput
            w={"24%"}

            size="sm"

            label="Entrega (D/ úteis)"
            placeholder="dias úteis"
            radius="lg"
            min={0}

            // configurações do valor do input
            value={delivery ?? ''}
            onChange={(value) =>
                dispatch(setValuesField({ scope, key: 'delivery', value: value as number }))
            }
        />
    )
}

export default Delivery