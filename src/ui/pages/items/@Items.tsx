// mantine
import { Stack } from "@mantine/core";

// components
import SearchForm from "../../components/items/searchForm/@SearchForm.tsx";
import List from "../../components/items/list/@List.tsx";

const Items = () => {
    return (
        <Stack w={"100%"} h={"100%"}>
            <SearchForm />
            <List/>
        </Stack>
    )
}

export default Items;