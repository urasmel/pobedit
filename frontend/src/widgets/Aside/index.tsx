import Badge from '@/shared/components/Badge';
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Typography } from '@mui/material';

export const Aside = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                padding: 1,
                gap: 1,
                boxSizing: 'border-box',
                width: '15%',
                minWidth: "160px",
                maxWidth: "200px",
                boxShadow: "var(--shadow)",
            }}
        >

            <Badge link='/search'>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <SearchIcon
                        sx={{
                            color: "#344767",
                            fontSize: 24,
                        }}
                    />
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#344767",
                        }}
                    >
                        Поиск
                    </Typography>
                </Box>
            </Badge>

            <Badge link='/admin'>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <SettingsIcon
                        sx={{
                            color: "#344767",
                            fontSize: 24,
                        }}
                    />
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#344767",
                        }}
                    >
                        Управление
                    </Typography>
                </Box>
            </Badge>
        </Box >
    );
};
