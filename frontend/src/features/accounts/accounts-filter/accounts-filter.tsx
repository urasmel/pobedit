import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, useTheme } from '@mui/material';
import { AccountsFilterProps, TrackingOptions } from './accounts-filter-props';
import {
    Search as SearchIcon,
} from '@mui/icons-material';

export const AccountsFilter = (props: AccountsFilterProps) => {
    const theme = useTheme();

    return (
        <Box sx={{
            display: "flex",
            gap: "2rem",
            alignItems: "start",
            padding: theme.spacing(3),
            height: "auto",
            borderRadius: '20px',
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.default,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)'
            }
        }}>

            <TextField
                value={props.loginFilter}
                onChange={props.onLoginFilterChange}
                variant="outlined"
                placeholder="Поиск..."
                sx={{
                    width: "300px",
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        backgroundColor: theme.palette.background.paper,
                    }
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }
                }}
            />

            <FormControl sx={{
                width: "300px"
            }}>
                <InputLabel>Отслеживание</InputLabel>
                <Select
                    label="Отслеживание"
                    defaultValue=""
                    inputProps={{ 'aria-label': 'Статус' }}
                    onChange={event => props.onIsTrackingChange(TrackingOptions[event.target.value as keyof typeof TrackingOptions])}
                >
                    <MenuItem value={TrackingOptions.All}>Все</MenuItem>
                    <MenuItem value={TrackingOptions.Tracking}>Отслеживаемые</MenuItem>
                    <MenuItem value={TrackingOptions.NoTracking}>Не отслеживаемые</MenuItem>
                </Select>
            </FormControl>

        </Box>
    );
};
