import { ReactNode } from "react"

// style
import classes from './Main.module.css';

const Main = ({ children }: { children: ReactNode }) => {
    return (
        <div className={classes.main}>
            {children}
        </div>
    )
}

export default Main