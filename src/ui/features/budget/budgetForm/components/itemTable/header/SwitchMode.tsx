// mantine
import { Switch, Tooltip } from "@mantine/core"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setModeOff, setModeOn } from "../../../store/itemTableSwitch.slice";

const SwitchMode = () => {
    const dispatch = useAppDispatch();
    const switchMode = useAppSelector((state) => state.budgetForm.itemTableSwitch.mode);

    const handleSwitch = (mode: boolean) => {
        if (!mode) {
            return dispatch(setModeOff())
        }
        return dispatch(setModeOn())
    }

    return (
        <Tooltip label="Modo Simples" refProp="rootRef">
            <Switch
                size="xl"
                onLabel="On"
                offLabel="Off"
                radius="lg"

                checked={switchMode}
                onChange={(event) => handleSwitch(event.currentTarget.checked)}
            />
        </Tooltip>
    )
}

export default SwitchMode