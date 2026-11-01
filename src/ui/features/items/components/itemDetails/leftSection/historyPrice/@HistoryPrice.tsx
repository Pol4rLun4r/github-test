// mantine
import { Stack, Text, Skeleton } from "@mantine/core"

// components
import Table from "./table/@Table";
import Cards from "./Cards";

// redux
import { useAppSelector } from "@/app/reduxHooks";
import { selectLatestPriceFormatted } from "@/features/items/store/items.selectors";

const HistoryPrice = () => {
    const { itemWithReferenceLinks, records } = useAppSelector((state) => state.items.itemDetails);
    const latestPriceFormatted = useAppSelector(selectLatestPriceFormatted);
    const description = itemWithReferenceLinks?.description;

    return (
        <Stack>
            <Skeleton visible={description === undefined} height={"0.9rem"} radius="xl">
                <Text size="0.9rem" c="dimmed" truncate="end">{description}</Text>
            </Skeleton>

            <Cards
                data={[
                    {
                        title: "Preço mais recente",
                        value: latestPriceFormatted,
                        loading: itemWithReferenceLinks === undefined,
                    },
                    {
                        title: "Registros",
                        value: records,
                        loading: records === undefined,
                    },
                ]}
            />
            <Table itemReferenceId={itemWithReferenceLinks?.id} />
            <Text size="sm" c="dimmed">Exibindo os últimos 5 registros</Text>
        </Stack>
    )
}

export default HistoryPrice