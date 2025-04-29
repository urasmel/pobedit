import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, InputAdornment } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import { useMainStore, MainState, Action } from '@/app/stores';

export const SearchForm = () => {
    const searchQuery = useMainStore((state: MainState & Action) => state.searchQuery);
    const setSearchQuery = useMainStore((state: MainState & Action) => state.setSearchQuery);

    const navigate = useNavigate();

    const [error, setError] = useState('');

    const handleSearch = () => {
        if (!searchQuery.query) {
            setError('Строка запроса не может быть пустой!');
        } else {
            setError('');
            navigate("/result", { state: searchQuery });
        }
    };


    return (
        <Container sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "80%",
            padding: 2,
        }}>

            <TextField
                variant="outlined"
                label="Поиск"
                value={searchQuery.query}
                onChange={(e) => setSearchQuery({ ...searchQuery, query: e.target.value })}
                sx={{ marginBottom: 2, width: "30rem" }}
                error={!!error}
                helperText={error}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{ width: "150px" }}
            >
                Искать
            </Button>
        </Container>
    );
};
