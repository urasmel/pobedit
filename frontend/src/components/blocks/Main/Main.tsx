import styles from './Main.module.css';
import { Users } from '@/components/features/Users/Users';
import { Header } from 'components/blocks/Header/Header';
import { Footer } from 'components/blocks/Footer/Footer';
import Channels from '@/components/features/Channels/Channels';
import { MainState, useMainStore } from '@/store/MainStore';


export const Main = () => {

    const selectedUser = useMainStore((state: MainState) => state.selectedUser);

    return (
        <main className={styles.main}>

            <Header />

            <div className={styles.info}>

                <Users />

                <Channels user={selectedUser} />

            </div>

            <Footer />

        </main>
    );
};
