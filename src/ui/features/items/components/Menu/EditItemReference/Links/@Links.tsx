// mantine
import { Accordion, ThemeIcon, Text, Group, Badge, Stack, Button } from "@mantine/core";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { addReferenceLink } from "@/features/items/store/editItemReference.slice";

// icons
import { IconLink, IconPlus } from "@tabler/icons-react";

// components
import Input from "./Input";

const Links = () => {
    const dispatch = useAppDispatch();
    const referenceLinks = useAppSelector((state) => state.items.editItemReference?.reference_links);

    if (!referenceLinks) {
        return (
            <Text size="sm" c="dimmed" ta="center" py="xs">
                Nenhum item existente
            </Text>
        )
    }

    return (
        <Accordion variant="separated" radius="lg">
            <Accordion.Item value="reference-links">
                <Accordion.Control
                    icon={
                        <ThemeIcon
                            size="md"
                            radius="xl"
                            variant="light"
                            color={referenceLinks.length > 0 ? "violet" : "gray"}
                        >
                            <IconLink size={16} />
                        </ThemeIcon>
                    }
                >
                    <Group gap="xs">
                        <Text fw={500}>Links de referência</Text>
                        <Badge
                            size="sm"
                            variant="light"
                            color={referenceLinks.length > 0 ? "violet" : "gray"}
                        >
                            {referenceLinks.length}
                        </Badge>
                    </Group>
                </Accordion.Control>
                <Accordion.Panel>
                    <Stack gap="sm">
                        <Input />
                        <Button
                            type="button"
                            variant="light"
                            leftSection={<IconPlus size={16} />}
                            onClick={() => dispatch(addReferenceLink())}
                            radius="md"
                        >
                            Adicionar link
                        </Button>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}

export default Links