import { StopWordsManager } from "@/features/stop-words";
import { StopWord } from "@/shared/types";
import { GatherStateWidget } from "@/widgets/gather-widget";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";

const mockStopWords: StopWord[] = [
    { id: '1', word: 'спам', createdAt: new Date() },
    { id: '2', word: 'реклама', createdAt: new Date() },
];

const boxStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: 2,
    height: "100%",
    boxSizing: "border-box",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "16px"
};

export const ControlPage = () => {
    const [stopWords, setStopWords] = useState<StopWord[]>(mockStopWords);

    const handleAddStopWord = useCallback((word: string) => {
        const normalizedWord = word.trim().toLowerCase();
        if (!stopWords.some(item => item.word.toLowerCase() === normalizedWord)) {
            const newStopWord: StopWord = {
                id: Date.now().toString(),
                word,
                createdAt: new Date(),
            };
            setStopWords(prev => [...prev, newStopWord]);
        }
    }, [stopWords]);

    const handleEditStopWord = (id: string, newWord: string) => {
        setStopWords(prev => prev.map(sw => sw.id === id ? { ...sw, word: newWord } : sw));
    };

    const handleDeleteStopWord = (id: string) => {
        setStopWords(prev => prev.filter(sw => sw.id !== id));
    };

    return (
        <Box
            sx={boxStyles}
        >
            {/* <StopWordNotifications posts={posts} comments={comments} /> */}
            <GatherStateWidget />

            <StopWordsManager
                stopWords={stopWords}
                onAddStopWord={handleAddStopWord}
                onEditStopWord={handleEditStopWord}
                onDeleteStopWord={handleDeleteStopWord}
            />
        </Box>
    );
};

ControlPage.displayName = 'ControlPage';
