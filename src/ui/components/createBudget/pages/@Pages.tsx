/* eslint-disable react-hooks/static-components */
// mantine
import { Paper, Tabs, Avatar } from "@mantine/core"

// style
import classes from './Pages.module.css';

// icons
import { IconClipboardList, IconPencilMinus } from "@tabler/icons-react";

// Pages
import Items from "../items/@Items";
import Notes from "../notes/@Notes";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const Pages = () => {
  const listItems = useSelector((state: RootState) => state.createBudget.listItems);

  const hasClientNotes = useSelector((state: RootState) => state.createBudget?.client.notes) === undefined ? false : true;

  const quotationNotes = useSelector((state: RootState) => state.createBudget?.quotation.notes);
  const hasQuotationNotes = quotationNotes === undefined ? false : quotationNotes.trim().length > 0 ? true : false;

  const hasNotes = () => {
    let numberNotes: number = 0;

    if (hasClientNotes) numberNotes += 1
    if (hasQuotationNotes) numberNotes += 1

    return numberNotes
  }

  const iconSize = 25;

  const Amount = ({ amount }: { amount: number }) => {
    if (amount === 0 || amount === undefined) {
      return (<></>);
    }

    return (
      <Avatar size={iconSize} radius="xl">
        {amount.toString()}
      </Avatar>
    )
  };

  return (
    <Paper withBorder p="lg" w={'100%'} h={'100%'} radius="lg" mt="lg" className={classes.paper}>
      <Tabs
        radius="md"
        defaultValue="items"
        classNames={{
          root: classes.root,
          panel: classes.panel,
          list: classes.list
        }}
      >
        <Tabs.List justify="center">
          <Tabs.Tab value="items" leftSection={<IconClipboardList size={iconSize} />} rightSection={<Amount amount={listItems.length > 0 ? listItems.length : 0} />} >
            Items
          </Tabs.Tab>
          <Tabs.Tab value="notes" leftSection={<IconPencilMinus size={iconSize} />} rightSection={<Amount amount={hasNotes()} />} >
            Notas
          </Tabs.Tab>
        </Tabs.List>

        {/* páginas */}
        <Tabs.Panel value="items">
          <Items />
        </Tabs.Panel>
        <Tabs.Panel value="notes">
          <Notes />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  )
}

export default Pages