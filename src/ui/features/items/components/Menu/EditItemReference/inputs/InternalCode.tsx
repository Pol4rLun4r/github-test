// mantine
import { TextInput } from "@mantine/core";

// icons
import { IconBarcode } from "@tabler/icons-react"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { changeItemReferenceField } from "@/features/items/store/ItemReferenceFieldChange.thunk";
;

const InternalCode = () => {
    const itemReference = useAppSelector((state) => state.items.editItemReference)
    const dispatch = useAppDispatch();

    return (
        <TextInput
            label="Código interno"
            placeholder="Opcional"
            leftSection={<IconBarcode size={17} />}
            value={itemReference?.internal_code ?? ""}
            onChange={(event) => dispatch(changeItemReferenceField({
                key: "internal_code",
                value: event.currentTarget.value
            }))}
        />
    )
}

export default InternalCode