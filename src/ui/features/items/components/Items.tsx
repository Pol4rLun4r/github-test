// components
import Table from "./table/@Table";

// mantine
import { Button } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

// redux
import { useAppSelector } from "@/app/reduxHooks";

// api
import { useFindItemReferencesQuery } from "../store/items.api";

const Items = () => {
    const search = useAppSelector((state) => state.items.search);
    const [debouncedSearch] = useDebouncedValue(search ?? "", 250);

    const {
        data,
        error,
        isError,
        isLoading,
        refetch,
    } = useFindItemReferencesQuery(debouncedSearch.trim());

    if (isLoading) return <div>Carregando...</div>;

    if (isError) {
        const errorMessage = error && "error" in error && typeof error.error === "string"
            ? error.error
            : "Ocorreu um erro desconhecido.";

        return (
            <div role="alert">
                <p>Não foi possível carregar os itens: {errorMessage}</p>
                <Button onClick={() => refetch()}>Tentar novamente</Button>
            </div>
        );
    }

    const items = data ?? [];

    return items.length <= 0
        ? <div>Sem items</div>
        : <Table items={items} />;
};

export default Items;