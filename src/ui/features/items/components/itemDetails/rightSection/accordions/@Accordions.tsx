// mantine
import { Accordion } from "@mantine/core";

// components
import PriceComposition from "./PriceComposition";
import Calculations from "./Calculations";

// icons
import { IconAdjustmentsDollar, IconCalculator } from "@tabler/icons-react";

const data = [
    {
        value: "PriceComposition",
        title: "Composição de preço",
        icon: <IconAdjustmentsDollar />,
        content: <PriceComposition />
    },
    {
        value: "Calculations",
        title: "Cálculos",
        icon: <IconCalculator />,
        content: <Calculations />
    },
];

export const Accordions = () => {

    const items = data.map((accordion) => (
        <Accordion.Item key={accordion.value} value={accordion.value} >
            <Accordion.Control icon={accordion.icon}>
                {accordion.title}
            </Accordion.Control>
            <Accordion.Panel>{accordion.content}</Accordion.Panel>
        </Accordion.Item >
    ));

    return (
        <Accordion
            variant="separated"
            defaultValue={"PriceComposition"}
            disableCollapse
            style={{ minWidth: 0, maxWidth: "100%" }}
        >
            {items}
        </Accordion>
    )
}
