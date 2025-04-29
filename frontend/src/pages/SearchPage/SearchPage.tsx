import { Box } from "@mui/material";
import { SearchForm } from "@/features/SearchForm";
import { SearchSettingsForm } from "@/features/SearchSettingsForm";
;
export const SearchPage = () => {


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
            <SearchForm />
            <SearchSettingsForm />

        </Box>
    );
};

export default SearchPage;
