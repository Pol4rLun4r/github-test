// mantine
import { Button } from "@mantine/core"
import { notifications } from "@mantine/notifications";

// redux
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import resetAllCreateBudgetData from "../../../redux/createBudget/resetAllCreateBudgetData.thunk";

// utils
import { validateDocument } from "../../../utils/documentValidator";

// api
import services from "../../../services";

const CreateBudgetButton = () => {
    const items = useSelector((state: RootState) => state.createBudget.listItems);
    const client = useSelector((state: RootState) => state.createBudget.client);
    const quotation = useSelector((state: RootState) => state.createBudget.quotation);

    const dispatch = useDispatch<AppDispatch>();

    const isClient = validateDocument(client.document ?? "") && (client.name ?? "").trim().length > 0;

    const hasValues = items.length > 0 && isClient;

    const budgetData: CreateWithAllData = {
        client,
        quotation,
        items
    };

    const handleCreateBudget = async () => {
        console.log(budgetData.items);

        try {
            const res = await services.quotation.createWithItems(budgetData);

            if (!res.success) {
                return notifications.show({
                    title: 'Error ao criação cotação',
                    message: res.data,
                    position: 'bottom-right',
                    color: 'pink'
                })
            }

            notifications.show({
                title: 'Criado',
                message: 'Orçamento criado com sucesso!',
                position: 'bottom-right',
                color: 'teal'
            });

            dispatch(resetAllCreateBudgetData);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';

            notifications.show({
                title: 'Algo deu errado!',
                message: errorMessage,
                color: 'pink',
                position: 'bottom-right'
            })
        }
    };

    return (
        <Button
            radius="lg"
            size="md"
            disabled={!hasValues}
            onClick={() => handleCreateBudget()}
        >
            Criar Orçamento
        </Button>
    )
}

export default CreateBudgetButton;
