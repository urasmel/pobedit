import { useState, useEffect } from 'react';
import styles from './user-widget.module.css';
import { User } from '@/entities';

const UserWidget = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://api.example.com/user');
                const data = await response.json() as User;
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className={styles.splash}>Loading...</div>;
    }

    if (!user) {
        return <div className={styles.splash}>Error loading user data</div>;
    }

    return (
        <div className={styles.splash}>
            <h2>User Information</h2>
            <p>Name: {user.username}</p>
        </div>
    );
};

export default UserWidget;
