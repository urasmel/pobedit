import { TextField, Button, Switch, FormControlLabel, Box, InputAdornment } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
;
export const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [searchType, setSearchType] = useState("posts");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query.trim()) {
            alert("Please enter a search query.");
            return;
        }

        // Example API request (replace with your actual API endpoint)
        try {
            const response = await fetch(
                `https://api.example.com/search?query=${query}&type=${searchType}`
            );
            const data = await response.json();

            // Redirect to the results page with query and type as state
            navigate("/results", { state: { query, searchType, results: data } });
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
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
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
                            checked={searchType === "comments"}
                            onChange={(e) =>
                                setSearchType(e.target.checked ? "comments" : "posts")
                            }
                        />
                    }
                    label={`Искать в ${searchType === "posts" ? "Постах" : "Комментариях"}`}
                    sx={{ marginBottom: 2 }}
                />

                <TextField
                    label="Начиная с"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ marginBottom: 2, width: "300px", cursor: "pointer" }}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <TextField
                    label="Заканчивая"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ marginBottom: 2, width: "300px", cursor: "pointer" }}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />
            </Box>

        </Box>
    );
};

export default SearchPage;
