import { useCallback, useMemo } from 'react';
import { useMainStore } from "@/app/stores";
import { SearchType } from "@/entities/search/model/search-query";
import {
    Box,
    FormControlLabel,
    Switch,
    Typography
} from "@mui/material";
import {
    LocalizationProvider,
    DatePicker
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";


// Константы для лучшей поддерживаемости
const SEARCH_TYPE_LABELS = {
    [SearchType.posts]: "Постах",
    [SearchType.comments]: "Комментариях"
} as const;


const STYLES = {
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: "400px",
        padding: 2,
        gap: 2, // Заменяет marginBottom
    },
    datePicker: {
        width: "100%",
        maxWidth: "300px",
        cursor: "pointer"
    }
} as const;

// Компонент для обертки DatePicker (убирает дублирование)
const SearchDatePicker = ({
    label,
    value,
    onChange
}: {
    label: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
}) => (
    <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        sx={STYLES.datePicker}
        slotProps={{
            textField: {
                variant: "outlined",
            },
        }}
    />
);

export const SearchSettingsForm = () => {
    const { searchQuery, setSearchQuery } = useMainStore((state) => ({
        searchQuery: state.searchQuery,
        setSearchQuery: state.setSearchQuery,
    }));


    // Обработчики с useCallback
    const handleSearchTypeChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newSearchType = event.target.checked
            ? SearchType.comments
            : SearchType.posts;

        setSearchQuery({
            ...searchQuery,
            searchType: newSearchType
        });
    }, [searchQuery, setSearchQuery]);

    const handleStartDateChange = useCallback((date: Date | null) => {
        setSearchQuery({
            ...searchQuery,
            startDate: date
        });
    }, [searchQuery, setSearchQuery]);

    const handleEndDateChange = useCallback((date: Date | null) => {
        setSearchQuery({
            ...searchQuery,
            endDate: date
        });
    }, [searchQuery, setSearchQuery]);

    // Валидация дат (опционально)
    const isEndDateValid = useMemo(() => {
        if (!searchQuery.startDate || !searchQuery.endDate) return true;
        return searchQuery.endDate >= searchQuery.startDate;
    }, [searchQuery.startDate, searchQuery.endDate]);

    // Мемоизированные пропсы для переиспользуемых компонентов
    const switchControlProps = useMemo(() => ({
        control: (
            <Switch
                checked={searchQuery.searchType === SearchType.comments}
                onChange={handleSearchTypeChange}
            />
        ),
        label: `Искать в ${SEARCH_TYPE_LABELS[searchQuery.searchType]}`,
    }), [searchQuery.searchType, handleSearchTypeChange]);

    return (

        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={STYLES.root}>

                <FormControlLabel {...switchControlProps} />

                <SearchDatePicker
                    label="Начиная с"
                    value={searchQuery.startDate}
                    onChange={handleStartDateChange}
                />

                <SearchDatePicker
                    label="Заканчивая"
                    value={searchQuery.endDate}
                    onChange={handleEndDateChange}
                />

                {!isEndDateValid && (
                    <Typography
                        color="error"
                        variant="caption"
                    >
                        Конечная дата не может быть раньше начальной
                    </Typography>
                )}
            </Box>
        </LocalizationProvider>

    );
};

SearchSettingsForm.displayName = 'SearchSettingsForm';
