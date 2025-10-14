// pages/Dashboard.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Grid,
    Container,
    Typography,
    Tabs,
    Tab,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    List as ListIcon,
    BarChart as ChartIcon,
    Settings as SettingsIcon,
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
import { StopWordsManager, StopWordNotifications } from '@/features/stop-words';

// Mock данные для демонстрации
const mockStopWords: StopWord[] = [
    { id: '1', word: 'спам', createdAt: new Date() },
    { id: '2', word: 'реклама', createdAt: new Date() },
];

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
    const [stopWords, setStopWords] = useState<StopWord[]>(mockStopWords);
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [comments, setComments] = useState<PostComment[]>(mockComments);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error'; }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleAddStopWord = (word: string) => {
        const newStopWord: StopWord = {
            id: Date.now().toString(),
            word,
            createdAt: new Date(),
        };
        setStopWords(prev => [...prev, newStopWord]);
        showSnackbar('Стоп-слово добавлено', 'success');
    };

    const handleEditStopWord = (id: string, newWord: string) => {
        setStopWords(prev => prev.map(sw => sw.id === id ? { ...sw, word: newWord } : sw));
        showSnackbar('Стоп-слово обновлено', 'success');
    };

    const handleDeleteStopWord = (id: string) => {
        setStopWords(prev => prev.filter(sw => sw.id !== id));
        showSnackbar('Стоп-слово удалено', 'success');
    };

    const handleSortChange = (field: keyof Post, order: SortOrder) => {
        // В реальном приложении здесь будет запрос к API
        console.log('Sorting by:', field, order);
    };

    const handleFilterChange = (filters: { theme?: string; dateRange?: DateRange; }) => {
        // В реальном приложении здесь будет запрос к API
        console.log('Filters:', filters);
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Панель управления контентом
            </Typography>

            <StopWordNotifications posts={posts} comments={comments} />

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleTabChange} aria-label="dashboard tabs">
                    <Tab icon={<DashboardIcon />} label="Обзор" />
                    <Tab icon={<ListIcon />} label="Посты" />
                    <Tab icon={<ChartIcon />} label="Аналитика" />
                    <Tab icon={<SettingsIcon />} label="Настройки" />
                </Tabs>
            </Box>

            <TabPanel value={currentTab} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <SentimentChart data={mockChartData} height={300} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <PostList
                            posts={posts.slice(0, 5)}
                            onSortChange={handleSortChange}
                            onFilterChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StopWordsManager
                            stopWords={stopWords}
                            onAddStopWord={handleAddStopWord}
                            onEditStopWord={handleEditStopWord}
                            onDeleteStopWord={handleDeleteStopWord}
                        />
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
                <PostList
                    posts={posts}
                    onSortChange={handleSortChange}
                    onFilterChange={handleFilterChange}
                />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <SentimentChart data={mockChartData} />
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <StopWordsManager
                            stopWords={stopWords}
                            onAddStopWord={handleAddStopWord}
                            onEditStopWord={handleEditStopWord}
                            onDeleteStopWord={handleDeleteStopWord}
                        />
                    </Grid>
                </Grid>
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
        </Container>
    );
};

Analytics.displayName = 'Analytics';
