// mantine
import { Table } from "@mantine/core"

// utils
import calcAddItem from "@/utils/calcAddItem";
import { convertMarkupValue } from "@/utils/markupList";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface RowProps {
  item: ItemValues;
  selected: boolean;
  onSelect: (item: ItemValues) => void;
}

const Row = ({ item, selected, onSelect }: RowProps) => {
  const finalUnitValue = item.quantity > 0
    ? calcAddItem(item).finalUnitValue
    : undefined;

  const finalPrice = finalUnitValue !== undefined && Number.isFinite(finalUnitValue)
    ? brl.format(finalUnitValue)
    : "—"

  return (
    <Table.Tr
      aria-selected={selected}
      data-selected={selected || undefined}
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(item);
        }
      }}
      style={{
        height: 42,
        cursor: "pointer",
        backgroundColor: selected
          ? "light-dark(var(--mantine-color-violet-0), var(--mantine-color-violet-9))"
          : undefined,
      }}
    >
      <Table.Td>{finalPrice}</Table.Td>
      <Table.Td>{convertMarkupValue(item.markup)}%</Table.Td>
      <Table.Td>{item.created_at ?? "—"}</Table.Td>
    </Table.Tr>
  )
}

export default Row