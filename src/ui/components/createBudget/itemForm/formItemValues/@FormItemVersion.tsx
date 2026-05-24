// mantine
import { Divider, Group, Stack } from "@mantine/core";

// components
import UnitValue from "./inputs/UnitValue";
import Calc from "./Calc";
import Quantity from "./inputs/Quantity";
import IPI from "./inputs/IPI";
import ST from "./inputs/ST";
import Markup from "./inputs/Markup";
import PurchaseShipping from "./inputs/PurchaseShipping";
import ClearValues from "./ClearValues";
import ExtraValue from "./inputs/ExtraValue";
import Boarding from "./inputs/Boarding";

// redux
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

// types
import { ItemFormScope } from "../../../../redux/createBudget/items/itemFormSlice";

const FormItemVersion = ({ scope }: { scope: ItemFormScope }) => {
    const switchMode = useSelector((state: RootState) => state.createBudget.itemFormSwitchMode.mode);

    return (
        <Stack gap="md">
            <Group gap={0} align="flex-start" justify="space-between" style={{ position: "relative" }}>
                <ClearValues scope={scope} />
                <UnitValue scope={scope} />
                <Quantity scope={scope} />
                <Markup scope={scope} />
            </Group>
            {!switchMode ?
                <Stack gap="md">
                    <Group grow justify="center" align="flex-end">
                        <IPI scope={scope} />
                        <ST scope={scope} />
                        <PurchaseShipping scope={scope} />
                    </Group>
                    <Group grow justify="center" align="flex-end">
                        <Boarding scope={scope} />
                        <ExtraValue scope={scope} />
                    </Group>
                </Stack>
                :
                <Group grow justify="center" align="flex-end">
                    <Boarding scope={scope} />
                    <PurchaseShipping scope={scope} />
                </Group>
            }
            <Divider />
            <Calc scope={scope} />
        </Stack>
    )
}

export default FormItemVersion;