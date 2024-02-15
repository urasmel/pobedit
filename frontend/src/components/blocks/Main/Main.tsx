import styles from './Main.module.css';
import { Accounts } from '../../features/Accounts/Accounts';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import Chats from '../../features/Chats/Chats';
import { MainState, useMainStore } from '../../../store/MainStore';


export const Main = () => {

    const selectedAccount = useMainStore((state: MainState) => state.selectedAccount);

    return (
        <main className={styles.main}>

            <Header />

            <div className={styles.info}>

                <Accounts />

                <Chats account={selectedAccount} />

            </div>

            <Footer />

        </main>
    );
};
