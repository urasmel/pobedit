import { Box } from "@mui/material";
import { SearchForm } from "@/features/search-form";
import { SearchSettingsForm } from "@/features/search-settings-form";
;
export const SearchPage = () => {


    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",


                padding: 4,
                boxSizing: "border-box",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "16px"
            }}
        >
            <SearchForm />
            <SearchSettingsForm />

        </Box>
    );
};

export default SearchPage;
