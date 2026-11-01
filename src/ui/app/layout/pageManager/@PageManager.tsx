// styles
import classes from './PageManager.module.css';

// redux
import { activePage } from '../store/layout.selectors';
import { useAppSelector } from '@/app/reduxHooks';

// config
import { pageContentById } from '../pages';

const PageManager = () => {
  const activePageId = useAppSelector(activePage);
  const PageContent = pageContentById[activePageId];

  return (
    <main className={classes.main}>
      <PageContent />
    </main>
  )
}

export default PageManager;