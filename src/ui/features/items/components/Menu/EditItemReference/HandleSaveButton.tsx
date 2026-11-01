// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks"
import { resetItemReference } from "@/features/items/store/editItemReference.slice"
import { useUpdateItemReferenceMutation } from "@/features/items/store/items.api"
import { isHasChangeItemReferenceWithLinks, selectItemReferenceUpdatePayload } from "@/features/items/store/items.selectors"

// mantine
import { Button } from "@mantine/core"
import { notifications } from "@mantine/notifications"

// icons
import { IconDeviceFloppy } from "@tabler/icons-react"

interface HandleSaveButtonProps {
    onSaved: () => void
}

const HandleSaveButton = ({ onSaved }: HandleSaveButtonProps) => {
    const dispatch = useAppDispatch();

    const [saveItemReference, { isLoading: isSaving }] = useUpdateItemReferenceMutation();

    const hasChange = useAppSelector(isHasChangeItemReferenceWithLinks);

    const payload = useAppSelector(selectItemReferenceUpdatePayload);

    // save handler
    const handleSave = async () => {
        try {
            if (!payload) return;
            await saveItemReference(payload).unwrap();

            notifications.show({
                title: "Referência atualizada",
                message: "As alterações foram salvas com sucesso.",
                position: "bottom-right",
                color: "teal",
            });
            
            onSaved();
            dispatch(resetItemReference());
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : error && typeof error === "object" && "error" in error && typeof error.error === "string"
                    ? error.error
                    : "Não foi possível salvar as alterações. Tente novamente.";

            notifications.show({
                title: "Erro ao salvar referência",
                message,
                position: "bottom-right",
                color: "pink",
            });
        }

    }

    return (
        <Button
            type="button"
            variant="gradient"
            radius="lg"
            size="md"
            leftSection={<IconDeviceFloppy />}
            disabled={!hasChange}
            loading={isSaving}
            onClick={handleSave}
        >
            Salvar alterações
        </Button>
    )
}

export default HandleSaveButton