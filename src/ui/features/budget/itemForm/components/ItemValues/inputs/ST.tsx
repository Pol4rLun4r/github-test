// mantine
import { ActionIcon, Group, Tooltip } from "@mantine/core";

// components
import CurrencyInput from "@/shared/inputs/CurrencyInput";

// redux
import { getItemFormState } from "../../../store/itemForm.selectors";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, setValuesField, switchStMode } from "../../../store/itemForm.slice";

// Icons
import { IconSwitchHorizontal } from "@tabler/icons-react";

const ST = ({ scope }: { scope: ItemFormScope }) => {
    const { toggleStMode, item_values } = useAppSelector((state) => getItemFormState(state, scope));
    const dispatch = useAppDispatch();

    return (
        <Group gap={0} style={{ alignItems: "flex-end" }}>
            <CurrencyInput
                value={item_values.st}
                onValueChange={(value) =>
                    dispatch(setValuesField({ scope, key: "st", value }))
                }
                label={toggleStMode ? "ST em porcentagem" : "ST"}
                placeholder="(opcional)"
                width={138}
                mode={toggleStMode ? "percentage" : "currency"}
                styles={{
                    input: {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }
                }}
            />
            <Tooltip
                label="Trocar modo do ST (Real $ ou Porcentagem %)"
                openDelay={1000}
            >
                <ActionIcon
                    size={36}
                    radius="lg"
                    variant="default"

                    onClick={() => dispatch(switchStMode({ scope }))}

                    style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                    }}
                >

                    <IconSwitchHorizontal />
                </ActionIcon>
            </Tooltip>
        </Group >
    )
}

export default ST;