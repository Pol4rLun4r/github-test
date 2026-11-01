// mantine
import { Avatar, Button, Center, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// redux
import { ItemFormScope } from "@/features/budget/itemForm/store/itemForm.slice.ts";
import { useAppSelector } from "@/app/reduxHooks.ts";

// components
import Form from "./Form.tsx";
import List from "./List.tsx";

// icons
import { IconPlus } from "@tabler/icons-react";

const Links = ({ scope }: { scope: ItemFormScope }) => {
    const hasId = useAppSelector((state) => state.itemForm.form[scope]?.item_reference?.id);
    const links = useAppSelector((state) => state.itemForm.form[scope]?.reference_links);

    const [opened, { open, close }] = useDisclosure(false);

    const hasLinks = links.length <= 0 ? false : links.length > 0 ? true : false;

    return (
        <Stack gap="md">
            <Button
                variant={hasLinks ? "outline" : "default"}
                radius="lg"
                onClick={open}

                style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                }}

                leftSection={!hasLinks ? <Avatar size="sm" radius="xl"><IconPlus size={15} /></Avatar> : <span style={{ fontSize: 15 }} >{links.length}</span>}
            >
                {hasLinks ? `Link(s)` : 'Adicionar links'}
            </Button>

            <Modal
                opened={opened}
                onClose={close}
                title="Links"
                size="lg"
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                {hasId ? null :
                    (<Form scope={scope} />)
                }
                {hasLinks ? (
                    <List links={links} scope={scope} />
                ) : (
                    <Center>
                        <Text mt='md' c='dimmed'>Sem links de referencia/preço</Text>
                    </Center>
                )}
            </Modal>
        </Stack>
    )
}

export default Links