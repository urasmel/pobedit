import styles from './styles.module.scss';
import { Aside } from '../../components/Aside/Aside';
import { Main } from '../../components/Main/Main';

const Home = () => {
    return (

        <div className={styles['main_container']}>
            <Aside></Aside>
            <Main></Main>
        </div>
    );
};

export default Home;
