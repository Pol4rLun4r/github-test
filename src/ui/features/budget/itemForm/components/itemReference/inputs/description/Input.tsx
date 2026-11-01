// type
import type { ChangeEvent } from "react";
import type { JSX } from "react";

// mantine
import { Combobox, Tooltip, UnstyledButton, Text, TextInput, type ComboboxStore, Loader, ActionIcon } from "@mantine/core"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { getItemFormState } from "@/features/budget/itemForm/store/itemForm.selectors";
import { resetItemDescription, resetItemReference, type ItemFormScope } from "@/features/budget/itemForm/store/itemForm.slice";

// icons
import { IconX } from "@tabler/icons-react";

interface InputType {
    isLoader: boolean;
    options: JSX.Element[];
    combobox: ComboboxStore;
    scope: ItemFormScope;
    handleClearData: () => void;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ isLoader, options, combobox, handleClearData, handleChange, scope }: InputType) => {
    const dispatch = useAppDispatch();

    const { item_reference } = useAppSelector((state) => getItemFormState(state, scope));

    const description = item_reference.description;

    const handleClear = () => {
        if (item_reference.id) {
            return dispatch(resetItemReference(scope));
        }

        dispatch(resetItemDescription(scope));
    };

    return (
        <>
            <Combobox.Target>
                <div style={{ position: 'relative' }}>
                    <UnstyledButton style={{ position: 'absolute', right: 0, bottom: 40 }} onClick={() => handleClearData()} >
                        <Text c={'violet'}>Limpar dados</Text>
                    </UnstyledButton>
                    <Tooltip
                        disabled={description?.length !== 0 ? false : true}
                        label={description}
                        multiline
                        w={400}
                        offset={{ mainAxis: 16, crossAxis: -75 }}
                    >
                        <TextInput
                            radius="lg"
                            label="Descrição do item"
                            description="Busque por itens já cadastrados ou adicione um novo"
                            placeholder="Digite a descrição do item"

                            rightSection={description ? (
                                <ActionIcon
                                    variant="transparent"
                                    onClick={handleClear}
                                    aria-label="Limpar descrição"
                                >
                                    <IconX size={15} />
                                </ActionIcon>
                            ) : undefined}
                            withAsterisk

                            value={description}
                            onChange={handleChange}

                            readOnly={Boolean(item_reference.id)}

                            // configurações do combobox
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => combobox.closeDropdown()}
                            onClick={() => combobox.openDropdown()}
                        />
                    </Tooltip>
                </div>
            </Combobox.Target>

            {/* menu de opções */}
            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length === 0 && !isLoader ? (
                        <Combobox.Empty>Nenhum resultado</Combobox.Empty>
                    ) : isLoader ? (
                        <Combobox.Empty> <Loader /></Combobox.Empty>
                    ) : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </>
    )
}

export default Input;