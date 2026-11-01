import { useState } from "react";

// mantine
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// redux
import { ItemFormScope } from "../store/itemForm.slice";
import { useAppSelector } from "@/app/reduxHooks";
import { isCanSubmitItemForm } from "../store/itemForm.selectors";
import type { BudgetFormScope } from "../../budgetForm/store/@rootReducer";

interface HandleButtonProps {
    scope: ItemFormScope;
    budgetScope: BudgetFormScope;
    closeModal: () => void;
    onSubmit: () => Promise<void>;
}

const HandleButton = ({ scope, budgetScope, closeModal, onSubmit }: HandleButtonProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const canSubmit = useAppSelector((state) => isCanSubmitItemForm(state, scope, budgetScope));
    const isEditing = scope === "item_form_edit";

    const handleClick = async () => {
        // loading de "enviando dados"
        setIsSubmitting(true);

        try {
            await onSubmit();
            closeModal();

            notifications.show({
                title: isEditing ? "Item atualizado" : "Item adicionado",
                message: isEditing
                    ? "Item da cotação atualizado com sucesso!"
                    : "Novo item adicionado à cotação com sucesso!",
                position: "bottom-right",
                color: "teal",
            });
        } catch (error) {
            notifications.show({
                title: "Não foi possível salvar o item",
                message: error instanceof Error ? error.message : "Tente novamente.",
                position: "bottom-right",
                color: "red",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Button
            radius="lg"
            variant="gradient"
            onClick={handleClick}
            disabled={!canSubmit || isSubmitting}
            loading={isSubmitting}
        >
            {isEditing ? "Salvar alterações" : "Adicionar item"}
        </Button>
    );
};



export default HandleButton