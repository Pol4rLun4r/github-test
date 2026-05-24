// mantine 
import { Textarea } from "@mantine/core"

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { setNotes } from "../../../redux/createBudget/clientSlice";

const ClientNotes = () => {
    const notes = useSelector((state: RootState) => state.createBudget.client.notes);
    const dispatch = useDispatch<AppDispatch>();

    const hasId = useSelector((state: RootState) => state.createBudget.client.id);

    return (
        <Textarea
            label="Notas do cliente"
            description="Espaço para notas sobre o cliente"
            placeholder="(Opcional)"

            size="md"
            radius="lg"

            autosize
            minRows={4}
            maxRows={4}

            readOnly={hasId ? true : false}

            value={notes || ""}
            onChange={(e) => dispatch(setNotes(e.currentTarget.value))}
        />
    )
}

export default ClientNotes