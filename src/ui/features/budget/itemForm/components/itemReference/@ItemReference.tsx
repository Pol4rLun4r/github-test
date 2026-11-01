// mantine
import { Group, Stack } from "@mantine/core"

// redux
import { useAppSelector } from "@/app/reduxHooks"
import { getSwitchModeReferenceForm } from "../../store/itemForm.selectors"
import type { ItemFormScope } from "../../store/itemForm.slice";

// components
import Description from "./inputs/description/@Description";
import InternalCode from "./inputs/InternalCode";
import ManufacturerCode from "./inputs/ManufacturerCode";
import NCM from "./inputs/Ncm";
import Notes from "./inputs/Notes";
import Links from "./inputs/links/@Links";

const ItemReference = ({ scope }: { scope: ItemFormScope }) => {
  const switchMode = useAppSelector(getSwitchModeReferenceForm);

  return (
    <Stack>
      <Stack gap="md">
        <Stack gap="md">
          <Description scope={scope} />
          <Group
            grow
            justify="center"
            align="flex-end"
          >
            <InternalCode scope={scope} />
            {!switchMode && <ManufacturerCode scope={scope} />}
            {!switchMode && <NCM scope={scope} />}
          </Group>
        </Stack>
        <Group
          grow
          gap={0}
          pt="sm"
          style={{ display: switchMode ? "none" : undefined }}
        >
          <Links scope={scope} />
          <Notes scope={scope} />
        </Group>
      </Stack>
    </Stack>
  )
}

export default ItemReference