// mantine
import { NumberInput } from "@mantine/core"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, setValuesField } from "../../../store/itemForm.slice";

const Quantity = ({ scope }: { scope: ItemFormScope }) => {
    const quantity = useAppSelector((state) => state.itemForm.form[scope].item_values.quantity);
    const dispatch = useAppDispatch();

    return (
        <NumberInput
            w={'20%'}

            label="Quantidade"
            placeholder="00"
            withAsterisk
            radius='lg'

            min={1}

            decimalSeparator=","
            thousandSeparator="."

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // configurações do valor do input
            value={quantity ?? ''}
            onChange={(value) =>
                dispatch(setValuesField({ scope, key: 'quantity', value }))
            }
        />
    )
}

export default Quantity