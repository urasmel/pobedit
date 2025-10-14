import React, { useState } from 'react';
import {
    Box,
    Grid2,
    Container,
    Tabs,
    Tab,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    List as ListIcon,
    BarChart as ChartIcon,
} from '@mui/icons-material';

import { PostList } from '@/features/post-list';
import { SentimentChart } from '@/features/sentiment-chart';
import {
    StopWord,
    UserSentiment,
    ChartDataPoint,
    SortOrder,
    DateRange,
} from '@/shared/types';
import { Post } from '@/entities';
import { PostComment } from '@/entities';

// Mock данные для демонстрации

const mockPosts: Post[] = [
    {
        tlgId: 1,
        // title: 'Важное обновление системы',
        message: 'Сегодня мы выпустили важное обновление для нашей платформы...',
        // author: 'Администратор',
        date: new Date('2024-01-15'),
        sentiment: { score: 0.8, magnitude: 0.9, label: 'positive' },
        theme: 'обновления',
        hasStopWord: false,
        peerId: 2,
        commentsCount: 55
    },
    {
        tlgId: 2,
        // title: 'Проблемы с подключением',
        message: 'Некоторые пользователи сообщают о проблемах с подключением к серверу...',
        // author: 'Техподдержка',
        date: new Date('2024-01-14'),
        sentiment: { score: -0.6, magnitude: 0.8, label: 'negative' },
        theme: 'техподдержка',
        hasStopWord: true,
        peerId: 1,
        commentsCount: 50
    },
];

const mockComments: PostComment[] = [
    {
        tlgId: 1,
        postId: 1,
        message: 'Отличное обновление! Спасибо за работу',
        from: { tlg_id: 1, main_username: "sdf", is_active: true, is_bot: false, is_tracking: false, username: "sdfasdf", phone: "asdfkjalsdkf", first_name: "", last_name: "", photo: "", bio: "" },
        date: new Date('2024-01-15'),
        sentiment: { score: 0.9, magnitude: 0.7, label: 'positive' },
        hasStopWord: false,
        postTlgId: 1,
        peerId: 343,
        replyTo: 34
    },
    {
        tlgId: 2,
        postId: 2,
        message: 'asdfasdfОтличное обновление! Спасибо за работу',
        from: { tlg_id: 3, main_username: "sdasdff", is_active: true, is_bot: false, is_tracking: false, username: "sdfasdf", phone: "asdfkjalsdkf", first_name: "", last_name: "", photo: "", bio: "" },
        date: new Date('2024-03-14'),
        sentiment: { score: 0.9, magnitude: 0.7, label: 'positive' },
        hasStopWord: false,
        postTlgId: 34,
        peerId: 3434,
        replyTo: 344
    },
];

const mockChartData: ChartDataPoint[] = [
    { date: '2024-01-10', postSentiment: 0.5, commentSentiment: 0.3, postCount: 5, commentCount: 20 },
    { date: '2024-01-11', postSentiment: 0.7, commentSentiment: 0.6, postCount: 8, commentCount: 25 },
    { date: '2024-01-12', postSentiment: -0.2, commentSentiment: -0.1, postCount: 6, commentCount: 18 },
    { date: '2024-01-13', postSentiment: 0.9, commentSentiment: 0.8, postCount: 10, commentCount: 30 },
    { date: '2024-01-14', postSentiment: -0.5, commentSentiment: -0.3, postCount: 4, commentCount: 15 },
    { date: '2024-01-15', postSentiment: 0.8, commentSentiment: 0.7, postCount: 7, commentCount: 22 },
];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

export const Analytics: React.FC = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error'; }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleSortChange = (field: keyof Post, order: SortOrder) => {
        // В реальном приложении здесь будет запрос к API
        console.log('Sorting by:', field, order);
    };

    const handleFilterChange = (filters: { theme?: string; dateRange?: DateRange; }) => {
        // В реальном приложении здесь будет запрос к API
        console.log('Filters:', filters);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleTabChange} aria-label="dashboard tabs">
                    <Tab icon={<ListIcon />} label="Посты" />
                    <Tab icon={<ChartIcon />} label="Оценка" />
                </Tabs>
            </Box>

            <TabPanel value={currentTab} index={0}>
                <PostList
                    posts={posts}
                    onSortChange={handleSortChange}
                    onFilterChange={handleFilterChange}
                />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
                <Grid2 container spacing={3}>
                    <Grid2 size={12}>
                        <SentimentChart data={mockChartData} />
                    </Grid2>
                </Grid2>
            </TabPanel>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container >
    );
};

Analytics.displayName = 'Analytics';
