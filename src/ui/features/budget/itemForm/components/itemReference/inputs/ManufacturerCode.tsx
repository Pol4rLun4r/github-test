// mantine
import { TextInput } from "@mantine/core";

// redux
import { getItemFormState } from "../../../store/itemForm.selectors";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setReferenceField, type ItemFormScope } from "../../../store/itemForm.slice";

const ManufacturerCode = ({ scope }: { scope: ItemFormScope }) => {
    const { item_reference } = useAppSelector((state) => getItemFormState(state, scope));
    const dispatch = useAppDispatch();

    return (
        <TextInput
            label="Código do fabricante"
            placeholder="(opcional)"
            radius='lg'
            readOnly={!!item_reference.id} // desabilita se já tiver um item selecionado

            // configurações do valor do input
            value={item_reference.manufacturer_code ?? ""}
            onChange={(e) => dispatch(setReferenceField({ scope, key: 'manufacturer_code', value: e.currentTarget.value }))}
        />
    )
}

export default ManufacturerCode;