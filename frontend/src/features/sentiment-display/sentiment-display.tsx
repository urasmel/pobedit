// components/SentimentDisplay.tsx
import React from 'react';
import { Box, Typography, Chip, LinearProgress, Tooltip } from '@mui/material';
import {
    SentimentVerySatisfied as PositiveIcon,
    SentimentDissatisfied as NegativeIcon,
    SentimentNeutral as NeutralIcon,
} from '@mui/icons-material';
import { SentimentAnalysis } from '@/shared/types';

interface SentimentDisplayProps {
    sentiment: SentimentAnalysis;
    type: 'post' | 'comment' | 'user';
    size?: 'small' | 'medium' | 'large';
}

export const SentimentDisplay: React.FC<SentimentDisplayProps> = ({
    sentiment,
    type,
    size = 'medium',
}) => {
    const getSentimentColor = (score: number) => {
        if (score > 0.3) return 'success';
        if (score < -0.3) return 'error';
        return 'warning';
    };

    const getSentimentIcon = (label: string) => {
        switch (label) {
            case 'positive':
                return <PositiveIcon />;
            case 'negative':
                return <NegativeIcon />;
            case 'neutral':
                return <NeutralIcon />;
            default:
                return <NeutralIcon />;
        }
    };

    const getDisplayText = () => {
        switch (type) {
            case 'post':
                return 'Оценка поста';
            case 'comment':
                return 'Оценка комментария';
            case 'user':
                return 'Средняя оценка пользователя';
            default:
                return 'Эмоциональная оценка';
        }
    };

    const progressValue = ((sentiment.score + 1) / 2) * 100;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={`Score: ${sentiment.score.toFixed(2)}, Magnitude: ${sentiment.magnitude.toFixed(2)}`}>
                <Chip
                    icon={getSentimentIcon(sentiment.label)}
                    label={sentiment.label}
                    color={getSentimentColor(sentiment.score)}
                    variant="outlined"
                />
            </Tooltip>

            <Box sx={{ flexGrow: 1, minWidth: 100 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                    {getDisplayText()}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    color={getSentimentColor(sentiment.score)}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        mt: 0.5,
                    }}
                />
                <Typography variant="caption" display="block" textAlign="center">
                    {sentiment.score.toFixed(2)}
                </Typography>
            </Box>
        </Box>
    );
};
