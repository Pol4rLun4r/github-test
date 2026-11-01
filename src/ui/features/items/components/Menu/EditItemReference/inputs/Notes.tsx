// mantine
import { Textarea } from "@mantine/core";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { changeItemReferenceField } from "@/features/items/store/ItemReferenceFieldChange.thunk";

const Notes = () => {
    const itemReference = useAppSelector((state) => state.items.editItemReference)
    const dispatch = useAppDispatch();

    return (
        <Textarea
            radius="lg"
            label="Notas"
            placeholder="Adicione uma observação (opcional)"
            autosize
            minRows={2}
            maxRows={3}
            value={itemReference?.notes ?? ""}
            onChange={(event) => dispatch(changeItemReferenceField({
                key: "notes",
                value: event.currentTarget.value
            }))}
        />
    )
}

export default Notes