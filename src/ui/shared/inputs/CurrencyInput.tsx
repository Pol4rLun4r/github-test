import { useState, type ClipboardEvent } from "react";

// mantine
import { NumberInput, type NumberInputProps } from "@mantine/core";

// icons
import { IconCurrencyReal, IconPercentage } from "@tabler/icons-react";

type MantineProps = Omit<
    NumberInputProps,
    | "label"
    | "placeholder"
    | "withAsterisk"
    | "w"
    | "radius"
    | "leftSection"
    | "decimalSeparator"
    | "thousandSeparator"
    | "decimalScale"
    | "min"
    | "stepHoldDelay"
    | "stepHoldInterval"
    | "value"
    | "defaultValue"
    | "onChange"
    | "onFocus"
    | "onBlur"
    | "onPaste"
    | "onValueChange"
>;

interface CurrencyInputProps extends MantineProps {
    value: number | undefined;
    label: string;
    onValueChange: (value: number | undefined) => void;
    placeholder?: string;
    width?: string | number;
    withAsterisk?: boolean;
    mode?: "currency" | "percentage";
    onFocus?: NumberInputProps["onFocus"];
    onBlur?: NumberInputProps["onBlur"];
    onPaste?: NumberInputProps["onPaste"];
}

const CurrencyInput = ({
    value,
    onValueChange,
    label,
    placeholder,
    width,
    withAsterisk,
    mode = 'currency',
    onFocus,
    onBlur,
    onPaste,
    ...mantineProps
}: CurrencyInputProps) => {
    const [focused, setFocused] = useState(false);

    // toNumber("R$ 3.339,50") // 3339.5
    // toNumber("25,90")       // 25.9
    // toNumber("3339")        // 3339
    // toNumber("")            // undefined

    // converte textos em valores legítimos para o input numérico
    const toNumber = (input: string | number): number | undefined => {
        if (typeof input === "number") {
            return Number.isFinite(input) ? input : undefined;
        }

        const text = input
            .trim()
            .replace(/\u00A0/g, " ")
            .replace(/R\$\s*/gi, "")
            .trim();

        if (!text) return undefined;

        const lastComma = text.lastIndexOf(",");
        const normalized = lastComma >= 0
            ? `${text.slice(0, lastComma).replace(/[.\s\D]/g, "") || "0"}.${text
                .slice(lastComma + 1)
                .replace(/\D/g, "")
                .slice(0, 2)
                .padEnd(2, "0")}`
            : text.replace(/[.\s\D]/g, "");
        const number = Number(normalized);

        return Number.isFinite(number) ? number : undefined;
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        onPaste?.(event);
        if (event.defaultPrevented) return;

        const text = event.clipboardData.getData("text");
        event.preventDefault();
        onValueChange(toNumber(text));
    };

    return (
        <NumberInput
            {...mantineProps}
            label={label}
            placeholder={placeholder}
            withAsterisk={withAsterisk}
            w={width}
            radius="lg"
            leftSection={
                mode === "currency"
                    ? <IconCurrencyReal size={18} />
                    : <IconPercentage size={18} />
            }
            decimalSeparator=","
            thousandSeparator={focused || mode === "percentage" ? false : "."}
            decimalScale={2}
            min={0}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            value={value ?? ""}
            onFocus={(event) => {
                setFocused(true);
                onFocus?.(event);
            }}
            onBlur={(event) => {
                setFocused(false);
                onBlur?.(event);
            }}
            onPaste={handlePaste}
            onChange={(input) => onValueChange(toNumber(input))}
        />
    )
}

export default CurrencyInput