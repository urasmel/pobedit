import styles from './Main.module.css';
import { Accounts } from '../../components/Accounts/Accounts';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import Chats from '../../components/Chats/Chats';
import { MainState, useMainStore } from '../../store/MainStore';


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
