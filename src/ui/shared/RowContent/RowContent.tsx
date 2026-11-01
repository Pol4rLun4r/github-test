/* eslint-disable @typescript-eslint/no-explicit-any */
// mantine
import { Tooltip, CopyButton, Button } from "@mantine/core"
import { useHover } from "@mantine/hooks";

// icons
import { IconCheck, IconCopy } from "@tabler/icons-react";

// style
import classes from './Row.module.css';

interface RowContentProps {
    label: any;
    value?: any;
    /** desabilitar botão de cópia */
    disableCopyButton?: boolean;
    /** copiar apenas números */
    onlyNumbers?: boolean;
    /** texto extra ao copiar o valor */
    extraText?: string;
}

const RowContent = ({ label, value, disableCopyButton, extraText, onlyNumbers }: RowContentProps) => {
    const { hovered, ref } = useHover();

    const rowContentProps = {
        className: classes.row,
    }

    const iconsSize = 15

    // Normalizar o valor para exibição e cópia
    const normalizedLabel = value !== undefined && value !== null
        ? String(value)
        : label !== undefined && label !== null
            ? typeof label === 'string'
                ? label
                : String(label)
            : ''

    // Função para normalizar o valor, removendo caracteres não numéricos e tratando separadores decimais
    const normalizeOnlyNumbers = (value: string) => {
        const cleaned = value.replace(/[^0-9,.-]/g, '')
        if (!cleaned) return ''

        const lastComma = cleaned.lastIndexOf(',')
        const lastDot = cleaned.lastIndexOf('.')

        const hasDecimalSeparator = lastComma > lastDot
        const normalized = cleaned.replace(/\./g, '').replace(/,/g, '.')

        if (!hasDecimalSeparator) {
            return normalized.replace(/\./g, '')
        }

        const [integerPart, decimalPart] = normalized.split('.')
        return `${integerPart.replace(/\./g, '')},${decimalPart || '0'}`
    }

    // Valor a ser copiado, considerando o texto extra e a normalização
    const copyValue = extraText
        ? `${extraText} ${onlyNumbers ? normalizeOnlyNumbers(normalizedLabel) : normalizedLabel}`
        : onlyNumbers
            ? normalizeOnlyNumbers(normalizedLabel)
            : normalizedLabel

    return (
        <Tooltip label={copyValue} withArrow multiline maw={'40%'}>
            <span ref={ref} {...rowContentProps}>
                {disableCopyButton ? (
                    label
                ) : hovered ? (
                    <CopyButton value={copyValue}>
                        {({ copied, copy }) => (
                            <Button fullWidth size="compact-xs" color={copied ? 'teal' : 'var(--mantine-primary-color-filled)'} onClick={copy}>
                                {copied ? <IconCheck size={iconsSize} /> : <IconCopy size={iconsSize} />}
                            </Button>
                        )}
                    </CopyButton>
                ) : (label)
                }
            </span>
        </Tooltip>
    )
}

export default RowContent