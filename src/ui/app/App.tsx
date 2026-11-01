// global style
import './global.css'

// components
import MantineProvider from './MantineProvider'
import AppLayout from './layout/@AppLayout';

const App = () => {
    return (
        <MantineProvider>
            <AppLayout />
        </MantineProvider>
    )
}

export default App;