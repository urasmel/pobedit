import { Box } from "@mui/material";
import { SearchForm } from "@/features/search-form";
import { SearchSettingsForm } from "@/features/search-settings-form";
;
export const SearchPage = () => {


    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateRows: "250px 1fr",
                height: "100%",
                boxSizing: "border-box",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "16px",
                width: "100%",
            }}
        >
            <div style={{
                display: "flex",
                justifyContent: "end",
            }}>
                <SearchSettingsForm />
            </div>
            <SearchForm />

        </Box>
    );
};

export default SearchPage;
