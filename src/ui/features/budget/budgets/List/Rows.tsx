import { memo } from "react";
import type { ReactElement } from "react";

// mantine
import { Table } from "@mantine/core";

interface RowsType {
  budgets: Quotation[],
  seeBudget: (quotationId: Quotation['id']) => ReactElement
}

const Rows = ({ budgets, seeBudget }: RowsType) => {

  // converte valores numéricos para formatação da moeda brasileira ($ Real)
  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return (
    budgets.map((budget) => (
      <Table.Tr key={budget.id} data-budget-id={budget.id}>
        <Table.Td align="center">{seeBudget(budget.id)}</Table.Td>
        <Table.Td>{String(budget.id).padStart(6, "0")}</Table.Td>
        <Table.Td>{budget.notes}</Table.Td>
        <Table.Td>{brl.format(budget.total_value)}</Table.Td>
        <Table.Td>{budget.amount}</Table.Td>
        <Table.Td>{budget.created_at}</Table.Td>
        <Table.Td>{budget.updated_at}</Table.Td>
      </Table.Tr>
    ))
  );
};

export default memo(Rows);
