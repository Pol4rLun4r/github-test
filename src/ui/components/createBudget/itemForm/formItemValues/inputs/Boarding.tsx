// mantine
import { TextInput } from "@mantine/core";

// icons
import { IconCalendar } from "@tabler/icons-react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { ItemFormScope, setVersionField } from "../../../../../redux/createBudget/items/itemFormSlice";

const Boarding = ({ scope }: { scope: ItemFormScope }) => {
    const itemData = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_version);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <TextInput
            label="Embarque"
            placeholder='(opcional) ex: "3 dias"'
            radius='lg'

            leftSection={<IconCalendar size={18} />}

            // configurações do valor do input
            value={itemData.boarding || ''}
            onChange={(event) =>
                dispatch(setVersionField({ scope, key: 'boarding', value: event.currentTarget.value }))
            }
        />
    )
}

export default Boarding