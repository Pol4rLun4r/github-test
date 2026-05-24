// mantine
import { TextInput, Combobox, type ComboboxStore, Stack, Group, Text } from "@mantine/core"

// config
import { configInputs } from "../config";

// redux
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../redux/store";
import { setDocument } from "../../../../redux/createBudget/clientSlice";

// util
import { formatDocument } from "../../../../utils/formatDocument";
import { validateDocument } from "../../../../utils/documentValidator";

// react
import { useEffect, useState } from "react";

interface InputType {
    isLoader: boolean;
    combobox: ComboboxStore;
    suggestions: Partial<Client>[]
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ handleChange, combobox, isLoader, suggestions }: InputType) => {
    const document = useSelector((state: RootState) => state.createBudget.client.document);
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (document && validateDocument(document)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError(null);
        } else if (document) {
            setError("Documento inválido");
        }
    }, [document]);

    const textSize = "sm"

    const options = suggestions.map((client) => (
        <Combobox.Option key={client.id} value={client.id as unknown as string}>
            <Stack gap={5}>
                <Group gap={5}>
                    <Text size={textSize}>Documento:</Text>
                    <Text size={textSize} c={"dimmed"}>{formatDocument(client.document!)}</Text>
                </Group>
                <Group gap={5}>
                    <Text size={textSize}>Cliente:</Text>
                    <Text size={textSize} c={"dimmed"}>{client.name}</Text>
                </Group>
            </Stack>
        </Combobox.Option>
    ));

    return (
        <>
            <Combobox.Target>
                <TextInput
                    {...configInputs}
                    label="CNPJ ou CPF"
                    description="Informe o documento com ou sem pontuação"
                    placeholder="00.000.000/0000-00"

                    // configurações do valor do input
                    value={document || ''}
                    onChange={(e) => {
                        const newValue = e.currentTarget.value;
                        dispatch(setDocument(newValue));
                        handleChange(e)
                    }}

                    // configurações do combobox
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    onClick={() => combobox.openDropdown()}
                    error={error}
                />
            </Combobox.Target>

            {/* menu de opções */}
            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length === 0 && !isLoader ? (
                        <Combobox.Empty>Nenhum resultado</Combobox.Empty>
                    ) : isLoader ? (
                        <Combobox.Empty>Carregando...</Combobox.Empty>
                    ) : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </>
    )
}

export default Input;