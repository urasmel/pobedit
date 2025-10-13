import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { StopWord } from '@/shared/types';

interface StopWordsManagerProps {
    stopWords: StopWord[];
    onAddStopWord: (word: string) => void;
    onEditStopWord: (id: string, newWord: string) => void;
    onDeleteStopWord: (id: string) => void;
}

export const StopWordsManager: React.FC<StopWordsManagerProps> = ({
    stopWords,
    onAddStopWord,
    onEditStopWord,
    onDeleteStopWord,
}) => {
    const [newWord, setNewWord] = useState('');
    const [editingWord, setEditingWord] = useState<StopWord | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editText, setEditText] = useState('');

    const handleAddWord = () => {
        if (newWord.trim()) {
            onAddStopWord(newWord.trim());
            setNewWord('');
        }
    };

    const handleEditClick = (word: StopWord) => {
        setEditingWord(word);
        setEditText(word.word);
        setEditDialogOpen(true);
    };

    const handleEditSave = () => {
        if (editingWord && editText.trim()) {
            onEditStopWord(editingWord.id, editText.trim());
            setEditDialogOpen(false);
            setEditingWord(null);
            setEditText('');
        }
    };

    const handleDeleteClick = (id: string) => {
        onDeleteStopWord(id);
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Управление стоп-словами
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                    label="Новое стоп-слово"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAddWord();
                    }}
                    sx={{ flexGrow: 1 }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddWord}
                >
                    Добавить
                </Button>
            </Box>

            <List>
                {stopWords.map((stopWord) => (
                    <ListItem key={stopWord.id} divider>
                        <ListItemText primary={stopWord.word} />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => handleEditClick(stopWord)}
                                sx={{ mr: 1 }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteClick(stopWord.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Редактировать стоп-слово</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Стоп-слово"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') handleEditSave();
                        }}
                        fullWidth
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleEditSave} variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};
