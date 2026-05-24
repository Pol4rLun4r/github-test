// mantine
import { ActionIcon, Tooltip } from "@mantine/core"

// icon
import { IconEraser } from "@tabler/icons-react"

// redux
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../redux/store"
import { triggerClearClient } from "../../../redux/createBudget/clientSlice"

const CleanData = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Tooltip label='Limpar dados do cliente'>
            <ActionIcon
                size="xl"
                radius="lg"
                variant="light"
                onClick={() => dispatch(triggerClearClient())}
            >
                <IconEraser />
            </ActionIcon>
        </Tooltip>
    )
}

export default CleanData