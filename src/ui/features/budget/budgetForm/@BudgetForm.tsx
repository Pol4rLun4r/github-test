// components
import Items from "./components/itemTable/@ItemTable";
import QuotationInfo from './components/quotationInfo/@QuotationInfo';

// redux
import { BudgetFormScope } from "./store/@rootReducer";

// styles
import classes from './budgetForm.module.css'

const BudgetForm = ({ scope, close }: { close?: () => void, scope: BudgetFormScope }) => {
  return (
    <div className={classes.container}>
      <QuotationInfo scope={scope} close={close} />
      <Items scope={scope} />
    </div>
  )
}

export default BudgetForm;