// react
import { useEffect } from "react";

// mantine
import { Combobox, useCombobox } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// redux
import { useAppDispatch } from "@/app/reduxHooks";
import {
    resetItemReference,
    setItemReference,
    setReferenceField,
    setReferenceLinks,
    type ItemFormScope,
} from "@/features/budget/itemForm/store/itemForm.slice";

// api
import {
    useLazyGetReferenceLinksQuery,
    useLazySearchItemDescriptionQuery,
} from "@/features/budget/itemForm/store/item.api";

// components
import Input from "./Input";

interface DescriptionProps {
    scope?: ItemFormScope;
}

const Description = ({ scope = "item_form_add" }: DescriptionProps) => {
    const dispatch = useAppDispatch();

    const [
        searchItemDescription,
        { currentData, isFetching, error: searchError, reset: resetSearch },
    ] = useLazySearchItemDescriptionQuery();

    const [
        getReferenceLinks,
        { error: linksError, reset: resetReferenceLinks },
    ] = useLazyGetReferenceLinksQuery();

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    useEffect(() => {
        if (!searchError) return;

        const message = "error" in searchError
            ? searchError.error
            : "Não foi possível pesquisar pela descrição.";

        notifications.show({
            title: "Erro ao pesquisar pela descrição",
            message,
            position: "bottom-right",
            color: "pink",
        });
    }, [searchError]);

    useEffect(() => {
        if (!linksError) return;

        const message = "error" in linksError
            ? linksError.error
            : "Não foi possível buscar as notas do item.";

        notifications.show({
            title: "Erro ao buscar notas",
            message,
            position: "bottom-right",
            color: "pink",
        });
    }, [linksError]);

    const suggestions = currentData ?? [];
    
    const options = suggestions
        .filter((item): item is ItemReference & { id: number } => item.id != null)
        .map((item) => (
            <Combobox.Option key={item.id} value={String(item.id)}>
                {item.description}
            </Combobox.Option>
        ));

    useEffect(() => {
        if (!isFetching && options.length > 0) {
            combobox.selectFirstOption();
        }
    }, [isFetching, options.length, combobox]);

    const fetchSuggestions = (search: string) => {
        const query = search.trim();

        if (!query) {
            resetSearch();
            return;
        }

        void searchItemDescription(query);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;

        dispatch(setReferenceField({ scope, key: "description", value }));

        if (!value.trim()) {
            resetSearch();
            combobox.closeDropdown();
            return;
        }

        fetchSuggestions(value);
        combobox.updateSelectedOptionIndex();
        combobox.openDropdown();
    };

    const handleClearData = () => {
        dispatch(resetItemReference(scope));
        resetSearch();
        resetReferenceLinks();
        combobox.closeDropdown();
    };

    const handleOptionSubmit = async (optionValue: string) => {
        const item = suggestions.find(
            (suggestion) => String(suggestion.id) === optionValue,
        );

        if (!item?.id) return;

        dispatch(setItemReference({ scope, data: item }));
        resetSearch();
        combobox.closeDropdown();

        const result = await getReferenceLinks(item.id);
        if (!result.error) {
            dispatch(setReferenceLinks({ scope, links: result.data ?? [] }));
        }
    };

    return (
        <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
            <Input
                scope={scope}
                isLoader={isFetching}
                options={options}
                combobox={combobox}
                handleChange={handleChange}
                handleClearData={handleClearData}
            />
        </Combobox>
    );
}

export default Description;