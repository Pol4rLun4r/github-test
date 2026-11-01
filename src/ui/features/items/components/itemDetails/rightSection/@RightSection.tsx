// mantine
import { Stack, Title, Group, Card } from "@mantine/core";

// icons
import { IconFileEuro } from "@tabler/icons-react";

// components
import { Accordions } from "./accordions/@Accordions";
import FinalPrice from "./cards/FinalPrice";
import DeliveryTime from "./cards/DeliveryTime";
import SeeBudget from "./cards/SeeBudget";

const rightSection = ({ onViewBudget }: { onViewBudget: () => void }) => {
  return (
    <Card withBorder p={"md"} radius={"lg"} bg="var(--mantine-color-body)" style={{ minWidth: 0 }}>
      <Card.Section p={"md"} withBorder>
        <Stack>
          <Group>
            <IconFileEuro />
            <Title order={3}>Detalhes do preço</Title>
          </Group>
          <Group align="stretch" w={"100%"}>
            <FinalPrice  />
            <Stack>
              <DeliveryTime />
              <SeeBudget onViewBudget={onViewBudget} />
            </Stack>
          </Group>
        </Stack>
      </Card.Section>
      <Card.Section p={"sm"} withBorder style={{ minWidth: 0 }}>
        <Accordions />
      </Card.Section>
    </Card>
  )
}

export default rightSection;