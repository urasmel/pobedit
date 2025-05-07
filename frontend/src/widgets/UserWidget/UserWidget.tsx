import { useState, useEffect } from 'react';
import { User } from '@/entities';
import { Box } from '@mui/material';

export const UserWidget = () => {
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
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Error loading user data</div>;
    }

    return (
        <Box sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1rem",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: "var(--shadow)",
            textAlign: "center"
        }}>
            <h2>User Information</h2>
            <p>Name: {user.username}</p>
        </Box>
    );
};
