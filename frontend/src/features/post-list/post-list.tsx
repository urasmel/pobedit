// components/PostList.tsx
import React, { useMemo, useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Chip,
    Typography,
    Alert,
    TextField,
    MenuItem,
} from '@mui/material';
import { SortOrder, DateRange } from '@/shared/types';
import { SentimentDisplay } from '../sentiment-display';
import { Post } from '@/entities';

interface PostListProps {
    posts: Post[];
    onSortChange: (field: keyof Post, order: SortOrder) => void;
    onFilterChange: (filters: {
        theme?: string;
        dateRange?: DateRange;
        startDate?: Date;
        endDate?: Date;
    }) => void;
}

export const PostList: React.FC<PostListProps> = ({
    posts,
    onSortChange,
    onFilterChange,
}) => {
    const [sortField, setSortField] = useState<keyof Post>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [themeFilter, setThemeFilter] = useState('');
    const [dateRange, setDateRange] = useState<DateRange>('all');

    const themes = useMemo(() => {
        return Array.from(new Set(posts.map(post => post.theme))).sort();
    }, [posts]);

    const handleSort = (field: keyof Post) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        const newOrder: SortOrder = isAsc ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
        onSortChange(field, newOrder);
    };

    const handleThemeFilterChange = (theme: string) => {
        setThemeFilter(theme);
        onFilterChange({ theme: theme || undefined });
    };

    const handleDateRangeChange = (range: DateRange) => {
        setDateRange(range);
        onFilterChange({ dateRange: range });
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Список постов
            </Typography>

            {/* Фильтры */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    select
                    label="Тематика"
                    value={themeFilter}
                    onChange={(e) => handleThemeFilterChange(e.target.value)}
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="">Все тематики</MenuItem>
                    {themes.map(theme => (
                        <MenuItem key={theme} value={theme}>
                            {theme}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Период"
                    value={dateRange}
                    onChange={(e) => handleDateRangeChange(e.target.value as DateRange)}
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="all">Все время</MenuItem>
                    <MenuItem value="today">Сегодня</MenuItem>
                    <MenuItem value="week">Неделя</MenuItem>
                    <MenuItem value="month">Месяц</MenuItem>
                </TextField>
            </Box>

            {/* Таблица постов */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>Автор</TableCell> */}
                            <TableCell>Тематика</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'date'}
                                    direction={sortField === 'date' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('date')}
                                >
                                    Дата
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'sentiment'}
                                    direction={sortField === 'sentiment' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('sentiment')}
                                >
                                    Эмоциональная оценка
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Статус</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.tlgId} hover>
                                {/* <TableCell>{post.author}</TableCell> */}
                                <TableCell>
                                    <Chip label={post.theme} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    {post.date.toLocaleDateString('ru-RU')}
                                </TableCell>
                                <TableCell>
                                    <SentimentDisplay sentiment={post.sentiment} type="post" size="small" />
                                </TableCell>
                                <TableCell>
                                    {post.hasStopWord && (
                                        <Alert severity="warning" sx={{ py: 0, px: 1 }}>
                                            Стоп-слово
                                        </Alert>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
