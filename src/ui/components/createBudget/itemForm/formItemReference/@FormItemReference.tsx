// components
import Description from "./inputs/description/@Description";
import InternalCode from "./inputs/InternalCode";
import NCM from "./inputs/Ncm";
import ManufacturerCode from "./inputs/ManufacturerCode";

// redux
import type { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

// mantine
import { Divider, Group, Stack } from "@mantine/core";

// types
import type { ItemFormScope } from "../../../../redux/createBudget/items/itemFormSlice";
import Links from "./links/@Links";
import Notes from "./notes/@Notes.tsx";

const FormItemReference = ({ scope }: { scope: ItemFormScope }) => {
    const switchMode = useSelector((state: RootState) => state.createBudget.itemFormSwitchMode.mode);

    return (
        <Stack gap="md">
            <Stack gap="md">
                <Description scope={scope} />
                {!switchMode &&
                    <Group grow justify="center" align="flex-end">
                        <InternalCode scope={scope} />
                        <ManufacturerCode scope={scope} />
                        <NCM scope={scope} />
                    </Group>
                }
            </Stack>
            <Divider />
            <Group grow>
                <Links scope={scope} />
                <Notes scope={scope} />
            </Group>
        </Stack>
    )
};

export default FormItemReference;