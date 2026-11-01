// mantine
import { TextInput } from "@mantine/core";

// redux
import { getItemFormState } from "../../../store/itemForm.selectors";
import { useAppDispatch, useAppSelector } from '@/app/reduxHooks';
import { ItemFormScope, setReferenceField } from "../../../store/itemForm.slice";

const InternalCode = ({ scope }: { scope: ItemFormScope }) => {
    const { item_reference } = useAppSelector((state) => getItemFormState(state, scope));
    const dispatch = useAppDispatch();

    return (
        <TextInput
            label="Código interno"
            placeholder="(opcional)"
            radius='lg'
            readOnly={!!item_reference.id} // desabilita se já tiver um item selecionado

            // configurações do valor do input
            value={item_reference.internal_code ?? ""}
            onChange={(e) => dispatch(setReferenceField({ scope, key: 'internal_code', value: e.currentTarget.value }))}
        />
    )
}

export default InternalCode