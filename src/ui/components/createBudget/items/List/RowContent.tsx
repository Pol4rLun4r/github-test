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
    disableCopyButton?: boolean;
    extraText?: string;
}

const RowContent = ({ label, disableCopyButton, extraText }: RowContentProps) => {
    const { hovered, ref } = useHover();

    const rowContentProps = {
        className: classes.row,
    }

    const iconsSize = 15

    return (
        <Tooltip label={label} withArrow multiline maw={'40%'}>
            <span ref={ref} {...rowContentProps}>
                {disableCopyButton ? (
                    label
                ) : hovered ? (
                    <CopyButton value={extraText ? `${extraText} ${label}` : label}>
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