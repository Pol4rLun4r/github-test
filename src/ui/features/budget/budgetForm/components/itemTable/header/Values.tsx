import { useEffect } from "react";

// mantine
import { Group, NumberInput, NumberInputProps } from "@mantine/core";

// icon
import { IconCurrencyReal } from "@tabler/icons-react";

// utils
import calcAddItem from "@/utils/calcAddItem";

// redux
import { BudgetFormScope } from "../../../store/@rootReducer";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setAmount, setTotalValue } from "../../../store/quotationInfo.slice";

const Values = ({ scope }: { scope: BudgetFormScope }) => {
    const dispatch = useAppDispatch();

    const itemTable = useAppSelector((state) => state.budgetForm.itemTable[scope]);

    const calcValues = itemTable.map(item => {
        const values = item.item_values;

        const calcItem = calcAddItem(values)

        return calcItem;
    });

    const totalBudget = calcValues.reduce((sum, value) => sum + value.totalWithAll, 0);
    const totalMarkup = calcValues.reduce((sum, value) => sum + value.markupValue, 0);

    useEffect(() => {
        dispatch(setTotalValue({ scope, data: totalBudget }));
        dispatch(setAmount({scope, data: itemTable.length}));
    }, [dispatch, itemTable.length, scope, totalBudget]);

    const configInput: NumberInputProps = {
        decimalSeparator: ",",
        thousandSeparator: ".",
        decimalScale: 2,
        fixedDecimalScale: true,
        min: 0.00,

        placeholder: "00,00",
        radius: 'lg',

        readOnly: true,

        variant: "filled",
    }

    return (
        <Group grow maw={'45%'} miw={350}>
            <NumberInput
                label="Total do orçamento"
                leftSection={<IconCurrencyReal size={18} />}
                {...configInput}

                value={totalBudget}
            />
            <NumberInput
                label="Total do Markup"
                leftSection={<IconCurrencyReal size={18} />}
                {...configInput}

                value={totalMarkup}
            />
        </Group>
    )
}

export default Values;