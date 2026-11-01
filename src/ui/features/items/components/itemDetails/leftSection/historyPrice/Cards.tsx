// mantine
import { Group, Paper, Skeleton, Stack, Text } from "@mantine/core"

const configPaperProps = {
    bg: "light-dark(var(--mantine-color-violet-1), var(--mantine-color-violet-9))",
    radius: "lg",
    p: "sm",
    style: {
        borderColor: "light-dark(var(--mantine-color-violet-3), var(--mantine-color-violet-7))",
    },
}

interface CardsProps {
    data: CardProps[]
}

interface CardProps {
    title: string;
    value: string | number | undefined;
    loading: boolean;
}

const Card = ({ title, value, loading }: CardProps) => (
    <Paper {...configPaperProps}>
        <Stack gap={"xs"}>
            <Text c="light-dark(var(--mantine-color-violet-7), var(--mantine-color-violet-3))">
                {title}
            </Text>
            <Skeleton visible={loading} height={"1.2rem"} radius="xl">
                <Text
                    size="1.2rem"
                    c="light-dark(var(--mantine-color-violet-9), var(--mantine-color-violet-1))"
                >
                    {value}
                </Text>
            </Skeleton>
        </Stack>
    </Paper>
);

const Cards = ({ data }: CardsProps) => {
    return (
        <Group grow align="stretch">
            {data.map((card) => (
                <Card
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    loading={card.loading}
                />
            ))}
        </Group>
    )
};

export default Cards