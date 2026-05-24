// react
import { useState, useRef, useEffect } from "react";

// mantine
import { Combobox, useCombobox } from "@mantine/core"
import { notifications } from "@mantine/notifications";

// redux
import { AppDispatch } from "../../../../../../redux/store";
import { useDispatch } from "react-redux";
import { ItemFormScope, resetItemReference, setReferenceField, setItemReference, setReferenceLinks } from "../../../../../../redux/createBudget/items/itemFormSlice";

// api
import services from "../../../../../../services";

// components
import Input from "./Input";

const Description = ({ scope }: { scope: ItemFormScope }) => {
    const [isLoader, setIsLoader] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    const [suggestions, setSuggestions] = useState<ItemReference[]>([]);

    const fetchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const DEBOUNCE_MS = 500;

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const fetchSuggestions = async (search: string) => {
        if (!search.trim()) {
            setSuggestions([]);
            return;
        }

        const response = await services.item.searchDescription(search);

        if (!response.success) {
            setSuggestions([]);

            return notifications.show({
                title: 'Error ao pesquisar pela descrição',
                message: response.data,
                position: 'bottom-right',
                color: 'pink'
            })
        }

        const items = response.data;
        setSuggestions(Array.isArray(items) ? items : []);
    }

    useEffect(() => {
        return () => {
            setIsLoader(false);
            if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
        };
    }, []);

    const handleClearData = () => {
        dispatch(resetItemReference(scope));
        setSuggestions([]);
        setIsLoader(false);
    }

    // lida com a mudança no input de pesquisa
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault(); // previne o comportamento padrão do input

        const value = event.currentTarget.value; // valor digitado no input

        // se o valor estiver vazio, limpa as sugestões e reseta os dados do item
        if (!value.trim()) {
            if (fetchDebounceRef.current) {
                clearTimeout(fetchDebounceRef.current);
                fetchDebounceRef.current = null;
            }

            setIsLoader(false);
            setSuggestions([]);
            return;
        }

        // debounce para evitar muitas requisições enquanto o usuário digita
        if (fetchDebounceRef.current) {
            setIsLoader(true);
            clearTimeout(fetchDebounceRef.current);
        }

        // agenda a busca após o tempo de debounce
        fetchDebounceRef.current = setTimeout(() => {
            setIsLoader(false);
            fetchDebounceRef.current = null;
            fetchSuggestions(value);
        }, DEBOUNCE_MS);

        combobox.updateSelectedOptionIndex(); // atualiza a lista de opções do input
        combobox.openDropdown(); // abre o dropdown ao digitar e atualiza as opções

        dispatch(setReferenceField({ scope, key: 'description', value }));
    }

    // lida com o item selecionado (clicado ou pressionado Enter)
    const handleOptionSubmit = async (optionValue: string) => {
        const item = suggestions.find((s) => s.id === optionValue as unknown as number);

        if (item) {
            dispatch(setItemReference({ scope, data: item }));
        }

        const response = await services.item.getReferenceLinks(item?.id as number);

        if (!response.success) {
            setSuggestions([]);

            return notifications.show({
                title: 'Error ao buscar notas',
                message: response.data,
                position: 'bottom-right',
                color: 'pink'
            })
        }


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setReferenceLinks({ scope, links: response.data as any }));
        setSuggestions([]);

        combobox.closeDropdown();
    }

    const options = suggestions.map((item) => (
        <Combobox.Option key={item.id} value={item.id as unknown as string}>
            {item.description}
        </Combobox.Option>
    ));

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={handleOptionSubmit}
        >
            {/* target do input de pesquisa */}
            <Input
                scope={scope}
                isLoader={isLoader}
                options={options}
                combobox={combobox}
                handleChange={handleChange}
                handleClearData={handleClearData}
            />
        </Combobox>
    )
}

export default Description;