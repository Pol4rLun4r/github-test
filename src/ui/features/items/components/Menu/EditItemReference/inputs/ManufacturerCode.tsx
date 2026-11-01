// mantine
import { TextInput } from "@mantine/core";

// icons
import { IconHash } from "@tabler/icons-react"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { changeItemReferenceField } from "@/features/items/store/ItemReferenceFieldChange.thunk";
;

const ManufacturerCode = () => {
    const itemReference = useAppSelector((state) => state.items.editItemReference)
    const dispatch = useAppDispatch();

    return (
        <TextInput
            label="Código do fabricante"
            placeholder="Opcional"
            leftSection={<IconHash size={17} />}
            value={itemReference?.manufacturer_code ?? ""}
            onChange={(event) => dispatch(changeItemReferenceField({
                key: "manufacturer_code",
                value: event.currentTarget.value
            }))}
        />
    )
}

export default ManufacturerCode;