// mantine
import { Stack } from "@mantine/core";

// components
import SearchForm from "./components/SearchForm.tsx";
import Items from "./components/Items.tsx";

const ItemsPage = () => {
    return (
        <Stack w={"100%"} h={"100%"}>
            <SearchForm />
            <Items />
        </Stack>
    )
}

export default ItemsPage;