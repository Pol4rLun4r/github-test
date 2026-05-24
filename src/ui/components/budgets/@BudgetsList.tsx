// components
import List from "./List/@List.tsx"

// react-query
import { useQuery } from "@tanstack/react-query";

// api
import services from "../../services/index.ts";

const BudgetsList = () => {
  // puxa os dados dos orçamentos
  const fetchData = async () => {
    const result = await services.quotation.getAllSummary();

    if (!result.success) {
      return [];
    }

    const data = result.data
    return data === undefined ? [] : data;
  }

  const { isPending ,data } = useQuery({
    queryKey: ['budgetsData'],
    queryFn: () => fetchData().then((res) => res)
  })

  if (isPending) return 'Carregando...'

  return (
    <>
      {data!.length <= 0 ? <div>Sem orçamentos</div> : <List budgets={data!} />}
    </>
  )
}

export default BudgetsList