// components
import BoardingInput from "./BoardingInput";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, setValuesField } from "@/features/budget/itemForm/store/itemForm.slice";

const Boarding = ({ scope }: { scope: ItemFormScope }) => {
    const boarding = useAppSelector((state) => state.itemForm.form[scope].item_values.boarding);
    const dispatch = useAppDispatch();

    const baseDate = new Date();

    return (
        <BoardingInput
            baseDate={baseDate}
            onChange={(value) => dispatch(setValuesField({ scope, key: 'boarding', value }))}
            value={boarding ?? 0}
        />
    )
}

export default Boarding;