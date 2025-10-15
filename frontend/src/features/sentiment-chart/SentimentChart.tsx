// components/SentimentChart.tsx
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    ComposedChart,
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { ChartDataPoint } from '@/shared/types';

interface SentimentChartProps {
    data: ChartDataPoint[];
    height?: number;
}

export const SentimentChart: React.FC<SentimentChartProps> = ({
    data,
    height = 400,
}) => {
    const theme = useTheme();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2">{`Дата: ${label}`}</Typography>
                    <Typography color={theme.palette.primary.main}>
                        {`Оценка постов: ${payload[0].value.toFixed(2)}`}
                    </Typography>
                    <Typography color={theme.palette.secondary.main}>
                        {`Оценка комментариев: ${payload[1].value.toFixed(2)}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {`Постов: ${payload[2]?.value || 0}, Комментариев: ${payload[3]?.value || 0}`}
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Динамика эмоциональных оценок
            </Typography>
            <Box sx={{ width: '100%', height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU')}
                        />
                        <YAxis domain={[-1, 1]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="postCount"
                            fill={theme.palette.primary.light}
                            stroke="none"
                            name="Количество постов"
                            opacity={0.3}
                        />
                        <Area
                            type="monotone"
                            dataKey="commentCount"
                            fill={theme.palette.secondary.light}
                            stroke="none"
                            name="Количество комментариев"
                            opacity={0.3}
                        />
                        <Line
                            type="monotone"
                            dataKey="postSentiment"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2}
                            dot={{ fill: theme.palette.primary.main }}
                            name="Оценка постов"
                        />
                        <Line
                            type="monotone"
                            dataKey="commentSentiment"
                            stroke={theme.palette.secondary.main}
                            strokeWidth={2}
                            dot={{ fill: theme.palette.secondary.main }}
                            name="Оценка комментариев"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

SentimentChart.displayName = 'SentimentChart';
