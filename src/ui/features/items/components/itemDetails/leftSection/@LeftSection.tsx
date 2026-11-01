// mantine
import { Accordion, Paper } from "@mantine/core"

// icons
import { IconFileDescription, IconHistory } from "@tabler/icons-react";

// components
import HistoryPrice from "./historyPrice/@HistoryPrice";
import ItemReference from "./ItemReference";

const data = [
    {
        value: "HistoryPrice",
        title: "Histórico de Preços",
        icon: <IconHistory />,
        content: <HistoryPrice />
    },
    {
        value: "ItemReference",
        title: "Informações sobre o item",
        icon: <IconFileDescription />,
        content: <ItemReference />
    },
];

const LeftSection = () => {
    const items = data.map((accordion) => (
        <Accordion.Item key={accordion.value} value={accordion.value} >
            <Accordion.Control icon={accordion.icon}>
                {accordion.title}
            </Accordion.Control>
            <Accordion.Panel>{accordion.content}</Accordion.Panel>
        </Accordion.Item >
    ));

    return (
        <Paper radius={"lg"} bg="var(--mantine-color-body)">
            <Accordion
                variant="separated"
                defaultValue={"HistoryPrice"}
                disableCollapse
                radius={"lg"}
                style={{ minWidth: 0, maxWidth: "100%" }}
            >
                {items}
            </Accordion>
        </Paper>
    )
}

export default LeftSection