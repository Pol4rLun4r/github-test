// components
import ButtonHandleBudget from "./ButtonHandleBudget";
import QuotationNotes from "./QuotationNotes";

// redux
import { BudgetFormScope } from "../../store/@rootReducer";

// mantine
import { Group } from "@mantine/core";

interface QuotationInfoProps {
    close?: () => void;
    scope: BudgetFormScope;
}

const QuotationInfo = ({ scope, close }: QuotationInfoProps) => {
    return (
        <Group
            w="100%"
            mb='md'
            style={{
                alignItems: 'flex-end'

            }} >
            <QuotationNotes scope={scope} />
            <ButtonHandleBudget scope={scope} close={close} />
        </Group>
    )
}

export default QuotationInfo;