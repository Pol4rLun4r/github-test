import { useState, type ClipboardEvent } from "react";

// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";

// utils
import { ItemFormScope, setVersionField } from "../../../../../redux/createBudget/items/itemFormSlice";
import {
    normalizeBrazilianCurrency,
    convertToNumber,
} from "../../../../../utils/formatBrazilPrice";

type CurrencyInputs = Pick<ItemVersion, 'purchase_shipping' | 'st' | 'unit_price' | 'extra_value'>

type Inputs = keyof CurrencyInputs

interface CurrencyInputProps {
    // config
    scope: ItemFormScope;
    itemVersionInput: Inputs;

    // custom
    label: string;
    placeholder?: string;
    widthInput?: string | number;
    withAsterisk?: boolean;
}

const CurrencyInput = ({ scope, itemVersionInput, label, placeholder, widthInput, withAsterisk }: CurrencyInputProps) => {
    const itemValues = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_version);
    const dispatch = useDispatch<AppDispatch>();
    const [focused, setFocused] = useState(false);

    const setCurrencyValue = <K extends keyof CurrencyInputs>(
        key: K,
        value: CurrencyInputs[K]
    ) => {
        dispatch(
            setVersionField({ scope, key, value })
        );
    }

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const text = event.clipboardData.getData("text");
        event.preventDefault();
        setCurrencyValue(itemVersionInput, normalizeBrazilianCurrency(text));
    };

    return (
        <NumberInput
            // customização
            label={label}
            placeholder={placeholder}
            withAsterisk={withAsterisk}
            w={widthInput}

            // design do input
            radius='lg'
            leftSection={<IconCurrencyReal size={18} />}
            decimalSeparator=","
            thousandSeparator={focused ? false : "."}
            decimalScale={2}
            min={0.00}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // tratamento de valores
            value={itemValues[itemVersionInput] ?? ""}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onPaste={handlePaste}
            onChange={(value) => setCurrencyValue(itemVersionInput, convertToNumber(value))}
        />
    )
}

export default CurrencyInput