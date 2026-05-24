// mantine
import { Avatar, Button, Center, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// types
import { ItemFormScope } from "../../../../../redux/createBudget/items/itemFormSlice.ts";
import { RootState } from "../../../../../redux/store.ts";
import { useSelector } from "react-redux";

// components
import Form from "./Form";
import List from "./List";
import { IconPlus } from "@tabler/icons-react";

const Links = ({ scope }: { scope: ItemFormScope }) => {
    const hasId = useSelector((state: RootState) => state.createBudget.itemForm[scope]?.item_reference?.id);
    const links = useSelector((state: RootState) => state.createBudget.itemForm[scope]?.reference_links);
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Stack gap="md">
            <Button
                variant="default"
                radius="lg"
                onClick={open}

                leftSection={<Avatar size="sm" radius="xl">{links.length <= 0 ? <IconPlus size={15} /> : links.length}</Avatar>}
            >
                Adicionar links
            </Button>

            <Modal
                opened={opened}
                onClose={close}
                centered
                title="Links"
                radius='lg'
                size="lg"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                {hasId ? null :
                    (<Form scope={scope} />)
                }
                {links.length > 0 ? (
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