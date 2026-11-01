// mantine
import { TextInput } from "@mantine/core";

// icons
import { IconFileText } from "@tabler/icons-react"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { changeItemReferenceField } from "@/features/items/store/ItemReferenceFieldChange.thunk";
;

const Description = () => {
    const itemReference = useAppSelector((state) => state.items.editItemReference);
    const dispatch = useAppDispatch();

    return (
        <TextInput
            withAsterisk
            label="Descrição"
            placeholder="Digite a descrição do item"
            leftSection={<IconFileText size={17} />}
            value={itemReference?.description}
            onChange={(event) => dispatch(changeItemReferenceField({
                key: "description",
                value: event.currentTarget.value
            }))}
        />
    )
}

export default Description