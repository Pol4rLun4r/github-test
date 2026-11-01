// mantine
import { Divider, Paper, SimpleGrid, Stack } from "@mantine/core"

// components
import Description from "./Description"
import InternalCode from "./InternalCode"
import ManufacturerCode from "./ManufacturerCode"
import NCM from "./NCM"
import Notes from "./Notes"

const Inputs = () => {
    return (
        <Paper withBorder radius="lg" p="md">
            <Stack>
                <Description />
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
                    <InternalCode />
                    <ManufacturerCode />
                    <NCM />
                </SimpleGrid>
                <Divider />
                <Notes />
            </Stack>
        </Paper>
    )
}

export default Inputs