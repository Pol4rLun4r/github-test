// mantine
import { Stack } from "@mantine/core";

// components
import ClientNotes from "./ClientNotes";
import QuotationNotes from "./QuotationNotes";

const Notes = () => {

    return (
        <Stack mt="md">
            <ClientNotes />
            <QuotationNotes />
        </Stack>
    )
}

export default Notes;