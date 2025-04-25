import { TextField, Button, Switch, FormControlLabel, Box, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { SearchType } from "@/entities/search/model/SearchQuery";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Action, MainState, useMainStore } from "@/app/stores";
;
export const SearchPage = () => {

    const searchQuery = useMainStore((state: MainState & Action) => state.searchQuery);
    const setSearchQuery = useMainStore((state: MainState & Action) => state.setSearchQuery);

    const navigate = useNavigate();

    const handleSearch = async () => {
        navigate("/result", { state: searchQuery });
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "80%",
                    padding: 2,
                }}
            >

                <TextField
                    variant="outlined"
                    value={searchQuery.query}
                    onChange={(e) => setSearchQuery({ ...searchQuery, query: e.target.value })}
                    sx={{ marginBottom: 2, width: "300px" }}
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
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    maxWidth: "400px",
                    justifyItems: "start",
                    padding: 2,
                }}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={searchQuery.searchType === SearchType.comments}
                            onChange={(e) =>
                                setSearchQuery({ ...searchQuery, searchType: e.target.checked ? SearchType.comments : SearchType.posts })
                            }
                        />
                    }
                    label={`Искать в ${searchQuery.searchType === "posts" ? "Постах" : "Комментариях"}`}
                    sx={{ marginBottom: 2 }}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        sx={{ marginBottom: 2, width: "300px", cursor: "pointer" }}
                        label="Начиная с"
                        value={searchQuery.startDate}
                        onChange={(e) => setSearchQuery({ ...searchQuery, startDate: e })}
                    />
                </LocalizationProvider>



                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        sx={{ marginBottom: 2, width: "300px", cursor: "pointer" }}
                        label="Заканчивая"
                        value={searchQuery.endDate}
                        onChange={(e) => setSearchQuery({ ...searchQuery, endDate: e })}
                    />
                </LocalizationProvider>

            </Box>

        </Box>
    );
};

export default SearchPage;
