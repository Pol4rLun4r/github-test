// redux
import { useAppSelector } from "@/app/reduxHooks";
import { activePageData } from "../store/layout.selectors";

// style
import classes from './FrameBar.module.css';

const CenterTitle = () => {
    const activePageLabel = useAppSelector(activePageData)?.label;

    return (
        <div className={classes.centerTitle} >{activePageLabel}</div>
    )
}

export default CenterTitle;