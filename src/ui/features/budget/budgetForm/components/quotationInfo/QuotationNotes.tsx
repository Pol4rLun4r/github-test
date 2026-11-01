// mantine
import { Textarea } from "@mantine/core"

// redux
import { BudgetFormScope } from "../../store/@rootReducer";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setNotes } from "../../store/quotationInfo.slice";

const QuotationNotes = ({ scope }: { scope: BudgetFormScope }) => {
    const notes = useAppSelector((state) => state.budgetForm.quotationInfo[scope].notes);
    const dispatch = useAppDispatch();

    return (
        <Textarea
            label="Notas da cotação"
            placeholder="(Opcional)"

            radius="lg"

            size="md"

            autosize
            maxRows={2}

            spellCheck={true}

            value={notes || ""}
            onChange={(e) => dispatch(setNotes({ scope, data: e.currentTarget.value }))}

            flex={1}
        />
    )
}

export default QuotationNotes