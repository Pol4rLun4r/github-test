// mantine
import { ActionIcon, Group, TextInput, Tooltip } from "@mantine/core";

// icons
import { IconEraser, IconSearch } from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { resetSearch, setSearch } from "@/features/items/store/search.slice";

const SearchForm = () => {
    const search = useAppSelector((state) => state.items.search);
    const dispatch = useAppDispatch();

    return (
        <Group style={{ width: "100%" }}>
            <TextInput
                size="md"
                radius="lg"
                placeholder="Buscar por itens já cadastrados"
                leftSection={<IconSearch />}
                flex={1}

                // configurações do valor do input
                value={search || ''}
                onChange={(e) => dispatch(setSearch(e.currentTarget.value))}
            />
            <Tooltip label='Limpar dados do cliente' position="bottom">
                <ActionIcon
                    size="xl"
                    radius="lg"
                    variant="light"
                    onClick={() => dispatch(resetSearch())}
                >
                    <IconEraser />
                </ActionIcon>
            </Tooltip>
        </Group>
    )
}

export default SearchForm;