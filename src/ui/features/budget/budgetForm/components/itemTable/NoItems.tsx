// mantine
import { Stack, Text } from "@mantine/core"

// icon
import { IconInvoice } from "@tabler/icons-react";

const NoItems = () => {
    return (
        <Stack align="center">
            <IconInvoice size={100} stroke={1} color="var(--mantine-color-dimmed)" />
            <Text size="lg" c="var(--mantine-color-dimmed)" >Nenhum item adicionado no momento.</Text>
        </Stack>
    )
}

export default NoItems