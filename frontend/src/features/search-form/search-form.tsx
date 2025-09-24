import { useCallback, useMemo, useState } from 'react';
import {
    TextField,
    Button,
    Container,
    InputAdornment,
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import { useMainStore } from '@/app/stores';

// Константы для легкого управления
const VALIDATION = {
    MIN_QUERY_LENGTH: 1,
    ERROR_MESSAGES: {
        EMPTY: 'Строка запроса не может быть пустой!',
        TOO_SHORT: 'Запрос должен содержать минимум 1 символ',
    }
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "80%",
        maxWidth: "600px", // Ограничиваем максимальную ширину
        padding: 2,
        gap: 2, // Используем gap вместо margin
    },
    textField: {
        width: "100%",
        maxWidth: "30rem",
    },
    button: {
        width: "150px",
        minWidth: "120px", // Минимальная ширина для мобильных
    }
};

export const SearchForm = () => {
    // const searchQuery = useMainStore((state: MainState & Action) => state.searchQuery);
    // const setSearchQuery = useMainStore((state: MainState & Action) => state.setSearchQuery);
    const { searchQuery, setSearchQuery } = useMainStore((state) => ({
        searchQuery: state.searchQuery,
        setSearchQuery: state.setSearchQuery,
    }));

    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Валидация запроса
    const validateQuery = useCallback((query: string): boolean => {
        if (!query.trim()) {
            setError(VALIDATION.ERROR_MESSAGES.EMPTY);
            return false;
        }
        if (query.trim().length < VALIDATION.MIN_QUERY_LENGTH) {
            setError(VALIDATION.ERROR_MESSAGES.TOO_SHORT);
            return false;
        }
        setError('');
        return true;
    }, []);

    // Обработчик изменения поля ввода
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchQuery({ ...searchQuery, query: newValue });

        // Сбрасываем ошибку при вводе
        if (error && newValue.trim().length >= VALIDATION.MIN_QUERY_LENGTH) {
            setError('');
        }
    }, [searchQuery, setSearchQuery, error]);

    // Обработчик поиска
    const handleSearch = useCallback(() => {
        if (validateQuery(searchQuery.query)) {
            navigate("/result", { state: searchQuery });
        }
    }, [searchQuery, navigate, validateQuery]);

    // Обработчик нажатия Enter
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    // Мемоизированные пропсы для TextField
    const textFieldProps = useMemo(() => ({
        variant: "outlined" as const,
        label: "Поиск",
        value: searchQuery.query,
        onChange: handleInputChange,
        onKeyPress: handleKeyPress,
        error: !!error,
        helperText: error,
        slotProps: {
            input: {
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            },
        },
        sx: styles.textField,
    }), [searchQuery.query, error, handleInputChange, handleKeyPress]);

    const buttonProps = useMemo(() => ({
        variant: "contained" as const,
        color: "primary" as const,
        onClick: handleSearch,
        sx: styles.button,
    }), [handleSearch]);

    return (
        <Container sx={styles.container}>
            <TextField {...textFieldProps} />
            <Button {...buttonProps}>
                Искать
            </Button>
        </Container>
    );
};
