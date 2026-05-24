// mantine
import { TextInput } from "@mantine/core";

// redux
import { AppDispatch, RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ItemFormScope, setReferenceField } from "../../../../../redux/createBudget/items/itemFormSlice";

const NCM = ({ scope }: { scope: ItemFormScope }) => {
    const itemData = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_reference);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <TextInput
            label="NCM"
            placeholder="(opcional)"
            radius='lg'
            readOnly={!!itemData.id} // desabilita se já tiver um item selecionado

            // configurações do valor do input
            value={itemData.ncm as string || ''}
            onChange={(e) => dispatch(setReferenceField({ scope, key: 'ncm', value: e.currentTarget.value }))}
        />
    )
}

export default NCM