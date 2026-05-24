import { Group } from "@mantine/core"

// components
import Buttons from "./Buttons";
import Values from "./Values";

const ItemsBar = () => {
    return (
        <Group justify="space-between" w={'100%'} align="flex-end">
            <Values />
            <Buttons />
        </Group>
    )
}

export default ItemsBar; 