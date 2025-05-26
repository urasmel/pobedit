import { useMainStore, MainState, Action } from "@/app/stores";
import { SearchType } from "@/entities/search/model/search-query";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export const SearchSettingsForm = () => {

    const searchQuery = useMainStore((state: MainState & Action) => state.searchQuery);
    const setSearchQuery = useMainStore((state: MainState & Action) => state.setSearchQuery);
    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
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
                    sx={{
                        marginBottom: 2,
                        width: "300px",
                        cursor: "pointer"
                    }}
                    label="Начиная с"
                    value={searchQuery.startDate}
                    onChange={(e) => setSearchQuery({ ...searchQuery, startDate: e })}
                />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    sx={{
                        marginBottom: 2,
                        width: "300px",
                        cursor: "pointer"
                    }}
                    label="Заканчивая"
                    value={searchQuery.endDate}
                    onChange={(e) => setSearchQuery({ ...searchQuery, endDate: e })}
                />
            </LocalizationProvider>

        </Box>

    );
};
