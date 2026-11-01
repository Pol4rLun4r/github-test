// mantine
import { Group, ThemeIcon, Text } from "@mantine/core"

// icons
import { IconFileText } from "@tabler/icons-react"

const Title = () => {
    return (
        <Group gap="sm" wrap="nowrap">
            <ThemeIcon size="lg" radius="md" variant="light" color="violet">
                <IconFileText size={19} />
            </ThemeIcon>
            <div>
                <Text fw={600}>Dados do item</Text>
                <Text size="xs" c="dimmed">Identificação e informações do item</Text>
            </div>
        </Group>
    )
}

export default Title