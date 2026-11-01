// mantine
import { Divider, Group, Stack, UnstyledButton, Text } from "@mantine/core";

// components
import UnitPrice from "./inputs/UnitPrice";
import Calc from "./Calc";
import Quantity from "./inputs/Quantity";
import IPI from "./inputs/IPI";
import ST from "./inputs/ST";
import Markup from "./inputs/Markup";
import PurchaseShipping from "./inputs/PurchaseShipping";
import ExtraValue from "./inputs/ExtraValue";
import Boarding from "./inputs/Boarding/@Boarding";
import Delivery from "./inputs/Delivery";
import HistoryPrice from "./HistoryPrice/@HistoryPrice";

// redux
import { ItemFormScope, resetItemValues } from "../../store/itemForm.slice";
import { getSwitchModeValuesForm } from "../../store/itemForm.selectors";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";

const ItemValues = ({ scope }: { scope: ItemFormScope }) => {
    const switchMode = useAppSelector(getSwitchModeValuesForm);
    const dispatch = useAppDispatch();

    const handleClear = () => {
        dispatch(resetItemValues(scope));
    };

    return (
        <Stack gap="md">
            <Group align="flex-end" style={{ position: "relative" }}>
                <UnstyledButton style={{ position: 'absolute', right: 0, top: 0 }} onClick={() => handleClear()} >
                    <Text c={'violet'}>Limpar dados</Text>
                </UnstyledButton>
                <HistoryPrice scope={scope}/>
                <UnitPrice scope={scope} />
                <Quantity scope={scope} />
                <Markup scope={scope} />
            </Group>
            <Stack gap="md">
                <Group
                    grow
                    justify="center"
                    align="flex-end"
                    style={{ display: switchMode ? "none" : undefined }}
                >
                    <IPI scope={scope} />
                    <ST scope={scope} />
                    <ExtraValue scope={scope} />
                </Group>
                <Group justify="center" align="flex-end">
                    <Boarding scope={scope} />
                    <Delivery scope={scope} />
                    <PurchaseShipping scope={scope} />
                </Group>
            </Stack>
            <Divider />
            <Calc scope={scope} />
        </Stack>
    )
}

export default ItemValues;