// mantine
import { NumberInputProps, Group, NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { useAppSelector } from "@/app/reduxHooks";
import { getItemFormState } from "../../store/itemForm.selectors";
import { ItemFormScope } from "../../store/itemForm.slice";

// utils
import calcAddItem from "@/utils/calcAddItem";

const configInput: NumberInputProps = {
    decimalSeparator: ",",
    thousandSeparator: ".",
    decimalScale: 2,
    fixedDecimalScale: true,
    min: 0.00,

    placeholder: "00,00",
    radius: 'lg',

    readOnly: true,
    tabIndex: -1,

    variant: "unstyled",
};

const Calc = ({ scope }: { scope: ItemFormScope }) => {
    const { item_values, toggleStMode: switchStMode } = useAppSelector((state) => getItemFormState(state, scope));

    const { totalWithoutTaxes, ipiValue, stValue, totalWithIPIandST, markupValue, totalWithAll, finalUnitValue } = calcAddItem({ ...item_values, switchStMode })

    return (
        <>
            <Group grow align="flex-end">
                <NumberInput
                    label="Total S/ impostos"
                    leftSection={<IconCurrencyReal size={18} />}
                    {...configInput}

                    value={totalWithoutTaxes}
                />
                <NumberInput
                    label="Valor Markup"
                    leftSection={<IconCurrencyReal size={18} />}
                    {...configInput}

                    value={markupValue}
                />
                <NumberInput
                    label="Valor IPI"
                    leftSection={<IconCurrencyReal size={18} />}
                    {...configInput}

                    value={ipiValue}
                />
                {switchStMode && (
                    <NumberInput
                        label="Valor ST"
                        leftSection={<IconCurrencyReal size={18} />}
                        {...configInput}

                        value={stValue}
                    />
                )}
            </Group>
            <Group grow align="flex-end">
                <NumberInput
                    label="Valor Total + IPI + ST"
                    leftSection={<IconCurrencyReal size={18} />}
                    {...configInput}

                    value={totalWithIPIandST}
                />
                <NumberInput
                    label="Total geral c/ Impostos"
                    leftSection={<IconCurrencyReal size={18} />}
                    {...configInput}

                    value={totalWithAll}
                />
                <NumberInput
                    label="Valor Unit Final"
                    leftSection={<IconCurrencyReal size={18} />}
                    {...configInput}

                    value={finalUnitValue}
                />
            </Group>
        </>
    )
}

export default Calc;