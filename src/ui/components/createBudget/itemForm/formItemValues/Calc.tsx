// mantine
import { NumberInputProps, Group, NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { ItemFormScope } from "../../../../redux/createBudget/items/itemFormSlice";

// hooks
import useCalcAddItem from "../../../../utils/calcAddItem";

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
    const itemData = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_version);
    const switchMode = useSelector((state: RootState) => state.createBudget.itemFormSwitchMode.mode);

    const { totalWithoutTaxes, ipiValue, totalWithIPIandST, markupValue, totalWithAll, finalUnitValue } = useCalcAddItem(itemData)

    if (switchMode) {
        return (
            <>
                <Group grow align="flex-end">
                    <NumberInput
                        label="Total sem Markup"
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
                </Group>
                <Group grow align="flex-end">
                    <NumberInput
                        label="Total geral c/ Markup"
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

    return (
        <>
            <Group grow align="flex-end">
                <NumberInput
                    label="Total sem impostos"
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