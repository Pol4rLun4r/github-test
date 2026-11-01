// mantine
import { Paper, Stack } from "@mantine/core"

// components
import Header from "./header/@Header";
import Table from "./table/@Table";
import NoItems from "./NoItems";

// style
import classes from './Items.module.css';

// redux
import { RootState } from '@/app/store';
import { useSelector } from "react-redux";
import { BudgetFormScope } from "../../store/@rootReducer";

const ItemTable = ({ scope }: { scope: BudgetFormScope }) => {
    const listItems = useSelector((state: RootState) => state.budgetForm.itemTable[scope]);

    return (
        <Stack className={classes.container}>
            <Paper withBorder radius="lg" className={classes.items}>
                <div className={classes.header}>
                    <Header scope={scope} />
                </div>
                <div className={classes.content}>
                    {listItems.length === 0 ? <NoItems /> : <Table scope={scope} />}
                </div>
            </Paper>
        </Stack>
    )
};

export default ItemTable;