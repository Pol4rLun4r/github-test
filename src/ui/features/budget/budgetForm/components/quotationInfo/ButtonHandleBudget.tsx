// mantine
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import type { BudgetFormScope } from "../../store/@rootReducer";
import { selectCanSubmitBudget } from "../../store/budgetForm.selectors";
import { submitBudget } from "../../store/submitBudget.thunk";

/** botão para lidar com a criação e edição de um orçamento */
const ButtonHandleBudget = ({
    scope,
    close,
}: {
    close?: (value?: "saved") => void;
    scope: BudgetFormScope;
}) => {
    const dispatch = useAppDispatch();
    const canSubmit = useAppSelector((state) => selectCanSubmitBudget(state, scope));

    const handleBudget = async () => {
        try {
            await dispatch(submitBudget({ scope })).unwrap();
            notifications.show({
                title: scope === "budget_form_create" ? "Criado" : "Editado",
                message: scope === "budget_form_create"
                    ? "Orçamento criado com sucesso!"
                    : "Orçamento editado com sucesso!",
                position: "bottom-right",
                color: "teal",
            });

            if (scope === "budget_form_edit") {
                close?.("saved");
            }
        } catch (error) {
            notifications.show({
                title: "Algo deu errado!",
                message: typeof error === "string"
                    ? error
                    : "Ocorreu um erro desconhecido ao salvar o orçamento.",
                color: "pink",
                position: "bottom-right",
            });
        }
    };

    return (
        <Button
            variant="gradient"
            radius="lg"
            size="md"
            w={250}
            disabled={!canSubmit}
            onClick={handleBudget}
        >
            {scope === "budget_form_create" ? "Criar Orçamento" : "Salvar alterações"}
        </Button>
    );
};

export default ButtonHandleBudget;
