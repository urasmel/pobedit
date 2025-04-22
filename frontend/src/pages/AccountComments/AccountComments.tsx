import { Box, Typography, Avatar, List, ListItem, Paper } from '@mui/material';

const AccountComments = () => {
    // Mock user data
    const user = {
        name: 'John Doe',
        avatar: 'https://avatar.iran.liara.run/public/38',
        comments: [
            {
                id: 1,
                date: '2023-10-01',
                channel: 'General Discussion',
                text: 'This is a sample comment.',
            },
            {
                id: 2,
                date: '2023-10-02',
                channel: 'Feedback',
                text: 'I really like this feature!',
            },
            {
                id: 3,
                date: '2023-10-03',
                channel: 'Support',
                text: 'Can someone help me with this issue?',
            },
            {
                id: 3,
                date: '2023-10-03',
                channel: 'Support',
                text: 'Can someone help me with this issue?',
            },
            {
                id: 3,
                date: '2023-10-03',
                channel: 'Support',
                text: 'Can someone help me with this issue?',
            },
            {
                id: 3,
                date: '2023-10-03',
                channel: 'Support',
                text: 'Can someone help me with this issue?',
            },
            {
                id: 3,
                date: '2023-10-03',
                channel: 'Support',
                text: 'Can someone help me with this issue?',
            },
            {
                id: 3,
                date: '2023-10-03',
                channel: 'Support',
                text: 'Can someone help me with this issue?',
            },
            {
                id: 3,
                date: '2023-10-03',
                channel: 'Support',
                text: 'Can someone help me with this issue?',
            },
            {
                id: 3,
                date: '2023-10-03',
                channel: 'Support',
                text: 'Can someone help me with this issue?',
            },
            {
                id: 3,
                date: '2023-10-03',
                channel: 'Support',
                text: 'Can someone help me with this issue?',
            },
        ],
    };

    return (
        <Box sx={{ padding: 2 }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 3,
                    padding: 2,
                    backgroundColor: 'primary.light',
                    borderRadius: 2,
                }}
            >
                <Avatar
                    src={`${import.meta.env.BASE_URL}ava.png`}
                    alt={user.name}
                    sx={{ width: 56, height: 56, marginRight: 2 }}
                />
                <Typography variant="h5">{user.name}</Typography>

            </Box>

            {/* Comments List */}
            <Typography variant="h6" gutterBottom>
                User Comments
            </Typography>
            <List>
                {user.comments.map((comment) => (
                    <ListItem key={comment.id} sx={{ marginBottom: 2 }}>
                        <Paper elevation={3} sx={{ width: '100%', padding: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {comment.date} - {comment.channel}
                            </Typography>
                            <Typography variant="body1">{comment.text}</Typography>
                        </Paper>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default AccountComments;
