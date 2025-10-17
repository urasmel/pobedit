import { useCallback, useState, useMemo } from 'react';
import {
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { StopWord } from '@/entities/stop-words/model/StopWord';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stopWordsApi } from '@/entities/stop-words';

export const StopWordsManager = () => {
    const queryClient = useQueryClient();

    const [newWord, setNewWord] = useState('');
    const [editingWord, setEditingWord] = useState<StopWord | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editText, setEditText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const {
        data: stopWords,
        isLoading,
        isError,
    } = useQuery(stopWordsApi.StopWordQueries.lists());

    // Фильтрация стоп-слов по поисковому запросу
    const filteredStopWords = useMemo(() => {
        if (!stopWords) return [];

        return stopWords.filter(stopWord =>
            stopWord.word.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [stopWords, searchTerm]);

    const swUpdateMutation = useMutation({
        mutationFn: stopWordsApi.updateStopWord,
        onSuccess: (data, variables) => {
            queryClient.setQueryData(stopWordsApi.StopWordQueries.lists().queryKey,
                (old: StopWord[] = []) =>
                    old.map(sw => (sw.id === variables.id ? data : sw))
            );
        },
    });

    const swCreateMutation = useMutation({
        mutationFn: stopWordsApi.createStopWord,
        onSuccess: (data) => {
            queryClient.setQueryData(stopWordsApi.StopWordQueries.lists().queryKey,
                (old: StopWord[] = []) =>
                    [...old, data]
            );
            // Очищаем поиск после добавления нового слова
            setSearchTerm('');
        },
    });

    const swDeleteMutation = useMutation({
        mutationFn: stopWordsApi.deleteStopWord,
        onSuccess: (_, variables) => {
            queryClient.setQueryData(stopWordsApi.StopWordQueries.lists().queryKey,
                (old: StopWord[] = []) => old.filter(sw => (sw.id !== variables))
            );
        },
    });

    const handleAddStopWord = useCallback((word: string) => {
        if (!stopWords) return;

        const normalizedWord = word.trim().toLowerCase();
        if (!stopWords.some(item => item.word.toLowerCase() === normalizedWord)) {
            swCreateMutation.mutate(normalizedWord);
        }
    }, [stopWords]);

    const handleEditStopWord = (id: number, newWord: string) => {
        if (!stopWords) return;

        const oldStopWord = stopWords.find((sw: StopWord) => sw.id === id);
        if (!oldStopWord) return;

        swUpdateMutation.mutate({ ...oldStopWord, word: newWord });
    };

    const handleDeleteStopWord = (id: number) => {
        swDeleteMutation.mutate(id);
    };

    const handleAddWord = () => {
        if (newWord.trim()) {
            handleAddStopWord(newWord.trim());
            setNewWord('');
        }
    };

    const handleEditClick = (word: StopWord) => {
        setEditingWord(word);
        setEditText(word.word);
        setEditDialogOpen(true);
    };

    const handleEditSave = () => {
        if (!stopWords) return;

        const isExists = stopWords.some(item =>
            item.word.toLowerCase() === editText.trim().toLowerCase() &&
            item.id !== editingWord?.id
        );

        if (!isExists && editingWord && editText.trim()) {
            handleEditStopWord(editingWord.id, editText.trim());
            setEditDialogOpen(false);
            setEditingWord(null);
            setEditText('');
        }
    };

    const handleDeleteClick = (id: number) => {
        handleDeleteStopWord(id);
    };

    const handleSearchClear = () => {
        setSearchTerm('');
    };

    if (isLoading) {
        return <Typography>Загрузка...</Typography>;
    }

    if (isError) {
        return <Typography color="error">Ошибка загрузки стоп-слов</Typography>;
    }

    return (
        <Box sx={{
            minWidth: 400,
            maxWidth: 500,
            p: 2,
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--weak-shadow)",
            display: 'flex',
            flexDirection: 'column',
            height: '600px', // Фиксированная высота контейнера
        }}>
            <Typography variant="h6" gutterBottom>
                Управление стоп-словами
                {stopWords && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                        sx={{ ml: 1 }}
                    >
                        ({filteredStopWords.length} из {stopWords.length})
                    </Typography>
                )}
            </Typography>

            {/* Поле поиска */}
            <TextField
                label="Поиск стоп-слов"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleSearchClear}
                                edge="end"
                            >
                                ✕
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2 }}
                placeholder="Введите для поиска..."
            />

            {/* Форма добавления нового слова */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                    label="Новое стоп-слово"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') handleAddWord();
                    }}
                    sx={{ flexGrow: 1 }}
                    size="small"
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddWord}
                    size="small"
                >
                    Добавить
                </Button>
            </Box>

            {/* Список стоп-слов с ограничением высоты и скроллом */}
            <Box sx={{
                flexGrow: 1,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
            }}>
                {filteredStopWords.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        color: 'text.secondary'
                    }}>
                        <Typography variant="body2">
                            {searchTerm ? 'Ничего не найдено' : 'Стоп-слова отсутствуют'}
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{
                        height: '100%',
                        overflow: 'auto',
                        '& .MuiListItem-root': {
                            px: 2,
                            py: 1,
                        }
                    }} dense>
                        {filteredStopWords.map((stopWord) => (
                            <ListItem
                                key={stopWord.id}
                                divider
                                secondaryAction={
                                    <Box sx={{ display: 'flex' }}>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() => handleEditClick(stopWord)}
                                            sx={{ mr: 0.5 }}
                                            size="small"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleDeleteClick(stopWord.id)}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                }
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={stopWord.word}
                                    primaryTypographyProps={{
                                        fontSize: '0.875rem',
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            {/* Диалог редактирования */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Редактировать стоп-слово</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Стоп-слово"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave();
                        }}
                        fullWidth
                        sx={{ mt: 1 }}
                        error={stopWords?.some(item =>
                            item.word.toLowerCase() === editText.trim().toLowerCase() &&
                            item.id !== editingWord?.id
                        )}
                        helperText={
                            stopWords?.some(item =>
                                item.word.toLowerCase() === editText.trim().toLowerCase() &&
                                item.id !== editingWord?.id
                            ) ? 'Такое стоп-слово уже существует' : ''
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
                    <Button
                        onClick={handleEditSave}
                        variant="contained"
                        disabled={
                            !editText.trim() ||
                            stopWords?.some(item =>
                                item.word.toLowerCase() === editText.trim().toLowerCase() &&
                                item.id !== editingWord?.id
                            )
                        }
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

StopWordsManager.displayName = 'StopWordsManager';
