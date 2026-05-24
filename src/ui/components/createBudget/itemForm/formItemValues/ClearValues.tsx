// mantine
import { UnstyledButton, Text } from "@mantine/core"

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { ItemFormScope, resetItemVersion } from "../../../../redux/createBudget/items/itemFormSlice";

const ClearValues = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleClear = () => {
        dispatch(resetItemVersion(scope));
    };

    return (
        <UnstyledButton style={{ position: 'absolute', right: 0, top: 0 }} onClick={() => handleClear()} >
            <Text c={'violet'}>Limpar dados</Text>
        </UnstyledButton>
    )
};

export default ClearValues