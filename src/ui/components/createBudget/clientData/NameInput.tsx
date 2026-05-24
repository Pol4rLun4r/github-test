// mantine
import { TextInput } from "@mantine/core"

// config
import { configInputs } from "./config";

// redux
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { setName } from "../../../redux/createBudget/clientSlice";

const NameInput = () => {
  const name = useSelector((state: RootState) => state.createBudget.client.name);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <TextInput
      {...configInputs}
      label="Nome do cliente"
      description="Informar o nome do cliente ou um apelido"
      placeholder="Polaroid da silva"

      // configurações do valor do input
      value={name || ''}
      onChange={(e) => dispatch(setName(e.currentTarget.value))}
    />
  )
}

export default NameInput;