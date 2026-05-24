/* eslint-disable react-hooks/set-state-in-effect */
// react
import { useEffect, useRef, useState } from "react";

// mantine
import { Combobox, useCombobox } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// components
import Input from "./Input";

// redux
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../redux/store";
import { setClient } from "../../../../redux/createBudget/clientSlice";
import { resetClient, resetClearClientTrigger } from "../../../../redux/createBudget/clientSlice";

// api
import clientService from "../../../../services/client-api";

// util
import { formatDocument } from "../../../../utils/formatDocument";

const DocumentInput = () => {
  const dispatch = useDispatch<AppDispatch>();
  const trigger = useSelector((state: RootState) => state.createBudget.client.clearClientTrigger);

  const [isLoader, setIsLoader] = useState(false);
  const [suggestions, setSuggestions] = useState<Client[]>([]);

  const fetchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DEBOUNCE_MS = 500;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  // busca os clientes no banco de dados
  const fetchSuggestions = async (search: string) => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const response = await clientService.search({ value: search, type: 'document' });

    if (!response.success) {
      setSuggestions([]);

      return notifications.show({
        title: 'Error ao buscar cliente',
        message: response.data,
        position: 'bottom-right',
        color: 'pink'
      })
    }

    const clients = response.data;
    setSuggestions(Array.isArray(clients) ? clients : []);
  };

  // lida com a mudança no input de pesquisa
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault(); // previne o comportamento padrão do input

    const value = event.currentTarget.value; // valor digitado no input

    // se o valor estiver vazio, limpa as sugestões e reseta os dados do item
    if (!value?.trim()) {
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
  }

  // lida com o cliente selecionado (clicado ou pressionado Enter)
  const handleOptionSubmit = async (optionValue: string) => {
    const client = suggestions.find((s) => s.id === optionValue as unknown as number);

    if (client) {
      dispatch(setClient({ ...client, clearClientTrigger: trigger, document: formatDocument(client.document!) }));
    }

    combobox.closeDropdown();

    setSuggestions([client!]);
  };

  // finaliza o timer do fetch de pesquisa quando o componente é desmontado
  useEffect(() => {
    return () => {
      setIsLoader(false);
      if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
    };
  }, []);

  // limpa os dados do cliente
  useEffect(() => {
    if (trigger) {
      dispatch(resetClient())
      dispatch(resetClearClientTrigger());
      setSuggestions([]);
      setIsLoader(false);
    }
  }, [trigger, dispatch]);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleOptionSubmit}
    >
      {/* target do input de pesquisa */}
      <Input handleChange={handleChange} suggestions={suggestions} combobox={combobox} isLoader={isLoader} />
    </Combobox>
  )
}

export default DocumentInput;