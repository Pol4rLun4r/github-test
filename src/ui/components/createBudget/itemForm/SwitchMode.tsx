// mantine
import { Switch, Tooltip } from "@mantine/core"

// redux
import type { AppDispatch, RootState } from "../../../redux/store"
import { useDispatch, useSelector } from "react-redux"
import { setModeOff, setModeOn } from "../../../redux/createBudget/items/itemFormSwitchModeSlice"

const SwitchMode = () => {
    const dispatch = useDispatch<AppDispatch>();
    const switchMode = useSelector((state: RootState) => state.createBudget.itemFormSwitchMode.mode);

    const handleSwitch = (mode: boolean) => {
        if (!mode) {
            return dispatch(setModeOff())
        }
        return dispatch(setModeOn())
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