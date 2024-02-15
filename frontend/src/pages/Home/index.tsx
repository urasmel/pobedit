import styles from './styles.module.scss';
import { Aside } from 'components/blocks/Aside/Aside';
import { Main } from 'components/blocks/Main/Main';

const Home = () => {
    return (

        <div className={styles['main_container']}>
            <Aside></Aside>
            <Main></Main>
        </div>
    );
};

export default Home;
