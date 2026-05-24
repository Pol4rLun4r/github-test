// styles
import classes from './CreateBudget.module.css'

// components
import ClientData from '../../components/createBudget/clientData/@ClientData';
import Pages from '../../components/createBudget/pages/@Pages';

const CreateBudget = () => {
    return (
        <div className={classes.container}>
            <ClientData />
            <Pages />
        </div>
    )
};

export default CreateBudget;