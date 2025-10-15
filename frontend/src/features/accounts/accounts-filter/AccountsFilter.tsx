import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { AccountsFilterProps, TrackingOptions } from './AccountsFilterProps';
import {
    Search as SearchIcon,
} from '@mui/icons-material';

const filterContainerStyles = {
    display: "flex",
    gap: "2rem",
    alignItems: "start",
    padding: 3, // Использование числового значения вместо theme.spacing(3)
    height: "auto",
    borderRadius: '20px',
    border: (theme) => `1px solid ${theme.palette.divider}`,
    background: (theme) => theme.palette.background.default,
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)'
    }
};

const textFieldStyles = {
    width: "300px",
    '& .MuiOutlinedInput-root': {
        borderRadius: '50px',
        backgroundColor: (theme) => theme.palette.background.paper,
    }
};

const formControlStyles = {
    width: "300px"
};

export const AccountsFilter = (props: AccountsFilterProps) => {

    const {
        loginFilter,
        onLoginFilterChange,
        onIsTrackingChange,
        trackingFilter = TrackingOptions.All // Значение по умолчанию
    } = props;

    const handleTrackingChange = (event: any) => {
        // event => props.onIsTrackingChange(TrackingOptions[event.target.value as keyof typeof TrackingOptions])
        const value = event.target.value as TrackingOptions;
        onIsTrackingChange(value);
    };

    return (
        <Box sx={filterContainerStyles}>

            <TextField
                value={loginFilter}
                onChange={onLoginFilterChange}
                variant="outlined"
                placeholder="Поиск..."
                sx={textFieldStyles}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }
                }}
                aria-label="Поиск аккаунтов"
            />

            <FormControl sx={formControlStyles}>
                <InputLabel id="tracking-filter-label">Отслеживание</InputLabel>
                <Select
                    labelId="tracking-filter-label"
                    label="Отслеживание"
                    // defaultValue=""
                    value={trackingFilter}
                    inputProps={{ 'aria-label': 'Статус' }}
                    onChange={handleTrackingChange}
                    aria-label="Фильтр отслеживания"
                >
                    <MenuItem value={TrackingOptions.All}>Все</MenuItem>
                    <MenuItem value={TrackingOptions.Tracking}>Отслеживаемые</MenuItem>
                    <MenuItem value={TrackingOptions.NoTracking}>Не отслеживаемые</MenuItem>
                </Select>
            </FormControl>

        </Box>
    );
};

AccountsFilter.displayName = 'AccountsFilter'; // Для отладки в React DevTools
