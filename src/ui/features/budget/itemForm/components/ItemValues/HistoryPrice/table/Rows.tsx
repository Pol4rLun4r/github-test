import { Table as MantineTable } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setValues, type ItemFormScope } from "../../../../store/itemForm.slice";
import calcAddItem from "@/utils/calcAddItem";
import { convertMarkupValue } from "@/utils/markupList";
import { UseDisclosureHandlers } from "@mantine/hooks";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface RowsProps {
  scope: ItemFormScope;
  items: ItemValues[];

  handlers: UseDisclosureHandlers
}

const formatCurrency = (value?: number) =>
  value !== undefined && Number.isFinite(value) ? brl.format(value) : "—";

const Rows = ({ scope, items, handlers }: RowsProps) => {
  const dispatch = useAppDispatch();
  const currentItemValues = useAppSelector((state) => state.itemForm.form[scope].item_values);

  const handleClick = (item: ItemValues) => {
    dispatch(setValues({
      scope,
      values: {
        ...item,
        id: currentItemValues.id,
        position: currentItemValues.position,
        created_at: currentItemValues.created_at,
        updated_at: currentItemValues.updated_at,
      },
    }));

    handlers.close();
  }

  return (
    <>
      {items.map((item, index) => {
        const finalUnitValue = item.quantity > 0
          ? calcAddItem(item).finalUnitValue
          : undefined;

        return (
          <MantineTable.Tr
            key={item.id ?? `${item.item_reference_id}-${index}`}
            onClick={() => {handleClick(item)}}
            style={{ cursor: "pointer" }}
          >
            <MantineTable.Td>{formatCurrency(item.unit_price)}</MantineTable.Td>
            <MantineTable.Td>{formatCurrency(finalUnitValue)}</MantineTable.Td>
            <MantineTable.Td>
              {item.markup === undefined ? "—" : `${convertMarkupValue(item.markup)}%`}
            </MantineTable.Td>
            <MantineTable.Td>{item.created_at ?? "—"}</MantineTable.Td>
          </MantineTable.Tr>
        );
      })}
    </>
  )
}

export default Rows