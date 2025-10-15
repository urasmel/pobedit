import { Users } from "@/features/users";
import { Channels } from "@/features/channels";
import { Box } from "@mui/material";
import { useMemo } from "react";

const useStyles = () => useMemo(() => ({
    root: {
        display: "grid",
        gridTemplateColumns: {
            xs: "1fr", // На мобильных - одна колонка
            lg: "repeat(2, 1fr)" // На десктопе - две колонки
        },
        gridTemplateRows: {
            xs: "repeat(2, 1fr)",
            lg: "1fr"
        },
        gridColumnGap: { xs: "0.5rem", lg: "1rem" }, // Разные отступы
        gridRowGap: { xs: "0.5rem", lg: "1rem" }, // Разные отступы
        width: "100%",
        maxWidth: "100%",
        minWidth: 0, // или overflow: 'hidden'
        height: "100%",
    },
    users: {
        gridArea: { xs: "1 / 1 / 2 / 2", lg: "1 / 1 / 2 / 2" },
        minWidth: 0, // Разрешает сжатие содержимого
        overflow: 'hidden',
    },
    channels: {
        gridArea: { xs: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }, // На мобильных - вторая строка
        minWidth: 0,
        overflow: 'hidden',
    }
}), []);

export const Main = () => {
    const styles = useStyles();

    return (
        <Box sx={styles.root}        >
            <Box sx={styles.users}>
                <Users />
            </Box>

            <Box sx={styles.channels}>
                <Channels />
            </Box>

        </Box>
    );
};

Main.displayName = 'Main';
