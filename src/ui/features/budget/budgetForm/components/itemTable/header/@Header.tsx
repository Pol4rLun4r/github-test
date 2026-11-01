// mantine
import { Group } from "@mantine/core"

// components
import Buttons from "./Buttons";
import Values from "./Values";

// redux
import { BudgetFormScope } from "../../../store/@rootReducer";

const Header = ({ scope }: { scope: BudgetFormScope }) => {
    return (
        <Group
            justify="space-between"
            w={'100%'}
            align="flex-end"
            p="md"
        >
            <Values scope={scope} />
            <Buttons scope={scope} />
        </Group>
    )
}

export default Header; 