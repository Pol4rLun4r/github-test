// mantine
import { Divider, Stack, Stepper } from "@mantine/core";

// redux
import type { ItemFormScope } from "./store/itemForm.slice";
import { useAppSelector } from "@/app/reduxHooks";
import { getStepState } from "./store/itemForm.selectors";
import { BudgetFormScope } from "../budgetForm/store/@rootReducer";

// components
import ItemReference from "./components/itemReference/@ItemReference";
import SwitchMode from "./components/SwitchMode";
import HiddenValueWarning from "./components/HiddenValueWarning";
import ItemValues from "./components/ItemValues/@ItemValues";
import StepsButtons from "./components/StepsButtons";

interface ItemFormProps {
  closeModal: () => void,
  scope: ItemFormScope,
  budgetScope: BudgetFormScope
}

const ItemForm = ({ scope, closeModal, budgetScope }: ItemFormProps) => {
  const step = useAppSelector((state) => getStepState(state, scope));

  return (
    <Stack gap={"xl"}>
      <SwitchMode mode={step === 0 ? "item_reference" : "item_values"} />
      <HiddenValueWarning scope={scope} />
      <Stepper active={step} size="sm" radius="xl">
        <Stepper.Step label="Dados básicos" description="Informações iniciais do item" >
          <ItemReference scope={scope} />
        </Stepper.Step>
        <Stepper.Step label="Valores" description="Defina os valores do item">
          <ItemValues scope={scope} />
        </Stepper.Step>
      </Stepper>
      <Divider />
      <StepsButtons scope={scope} closeModal={closeModal} budgetScope={budgetScope} />
    </Stack>
  )
}

export default ItemForm;