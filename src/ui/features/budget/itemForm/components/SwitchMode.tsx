// mantine
import { Switch, Tooltip } from "@mantine/core"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks"
import {
    setSwitchOffItemReference,
    setSwitchOffItemValues,
    setSwitchOnItemReference,
    setSwitchOnItemValues,
    type SwitchProps,
} from "../store/switch.slice"

interface InterfaceSwitchModeProps {
    mode: SwitchProps
}

const SwitchMode = ({ mode }: InterfaceSwitchModeProps) => {
    const dispatch = useAppDispatch();
    const switchMode = useAppSelector((state) => state.itemForm.switch[mode].mode);

    const handleSwitch = (switchValue: boolean) => {
        if (mode === "item_values") {
            if (!switchValue) {
                return dispatch(setSwitchOffItemValues())
            }
            return dispatch(setSwitchOnItemValues())
        }

        if (!switchValue) {
            return dispatch(setSwitchOffItemReference())
        }
        return dispatch(setSwitchOnItemReference())
    }

    return (
        <Tooltip label="Modo Simples" refProp="rootRef">
            <Switch
                size="lg"
                onLabel="On"
                offLabel="Off"
                radius="lg"

                checked={switchMode}
                onChange={(event) => handleSwitch(event.currentTarget.checked)}

                pos={"absolute"}
                top={"calc(var(--mantine-spacing-lg) * 1.5) "}
                right={"calc(var(--mantine-spacing-lg) * 3) "}
                style={{ zIndex: "9999" }}
            />
        </Tooltip>
    )
}

export default SwitchMode