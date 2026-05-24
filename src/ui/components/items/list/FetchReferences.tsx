// react
import { useEffect, useRef, useState } from "react";

// mantine
import { notifications } from "@mantine/notifications";
import { Table } from "@mantine/core";

// components
import { Rows } from "./Rows.tsx";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";

// api 
import services from "../../../services/index";


const FetchReferences = () => {
    const search = useSelector((state: RootState) => state.items.search)

    const [references, setReferences] = useState<ItemReference[]>([]);

    const fetchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const DEBOUNCE_MS = 500;

    const fetchReferences = async (querySearch: SearchItemDescriptionIsOptional) => {
        const response = await services.item.getAllBySearch(querySearch);

        if (!response.success) {
            setReferences([]);

            return notifications.show({
                title: 'Error ao pesquisar pela descrição',
                message: response.data,
                position: 'bottom-right',
                color: 'pink'
            })
        }

        const items = response.data!;
        
        setReferences(items);
    }

    useEffect(() => {
        return () => {
            if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
        };
    }, []);

    // lida com a mudança no input de pesquisa
    const handleChange = () => {
        // debounce para evitar muitas requisições enquanto o usuário digita
        if (fetchDebounceRef.current) {
            clearTimeout(fetchDebounceRef.current);
        }

        // agenda a busca após o tempo de debounce
        fetchDebounceRef.current = setTimeout(() => {
            fetchDebounceRef.current = null;
            fetchReferences(search);
        }, DEBOUNCE_MS);
    }

    useEffect(() => {
        handleChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    return (
        <Table.Tbody>
            <Rows references={references} />
        </Table.Tbody>
    )
}

export default FetchReferences;