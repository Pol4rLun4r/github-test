// mantine
import { Textarea } from "@mantine/core"

// redux
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setNotes } from "../../../redux/createBudget/quotationSlice";

const QuotationNotes = () => {
    const notes = useSelector((state: RootState) => state.createBudget.quotation.notes);
    const dispatch = useDispatch<AppDispatch>();


    return (
        <Textarea
            label="Notas da cotação"
            description="Espaço para notas sobre a cotação"
            placeholder="(Opcional)"

            size="md"
            radius="lg"

            autosize
            minRows={4}
            maxRows={4}

            value={notes || ""}
            onChange={(e) => dispatch(setNotes(e.currentTarget.value))}
        />
    )
}

export default QuotationNotes