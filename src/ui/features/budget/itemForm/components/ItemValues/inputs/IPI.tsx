// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, setValuesField } from "../../../store/itemForm.slice";

const IPI = ({ scope }: { scope: ItemFormScope }) => {
    const ipi = useAppSelector((state) => state.itemForm.form[scope].item_values.ipi);
    const dispatch = useAppDispatch();

    return (
        <NumberInput
            label="IPI"
            placeholder="(opcional)"
            radius='lg'

            leftSection={<IconPercentage size={18} />}

            decimalScale={2}
            decimalSeparator=","
            min={0}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // configurações do valor do input
            value={ipi ?? ''}
            onChange={(value) =>
                dispatch(setValuesField({ scope, key: 'ipi', value: value as number }))
            }
        />
    )
}

export default IPI