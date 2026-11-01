// style
import classes from './AppLayout.module.css';

// components
import FrameBar from './frameBar/@FrameBar';
import Sidebar from './sideBar/@Sidebar';
import PageManager from './pageManager/@PageManager';

const AppLayout = () => {
  return (
    <div className={classes.layout}>
      <FrameBar />
      <Sidebar />
      <PageManager />
    </div>
  )
}

export default AppLayout;