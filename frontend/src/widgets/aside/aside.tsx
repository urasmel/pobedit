import { Badge } from '@/shared/components/badge';
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ControlIcon from "@mui/icons-material/Settings";
import PeopleIcon from '@mui/icons-material/People';
import TuneIcon from "@mui/icons-material/Tune";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { Box, Typography } from '@mui/material';

export const Aside = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'row', lg: 'column' },
                borderRadius: "var(--radius-md)",
                padding: 1,
                gap: 1.5,
                boxSizing: 'border-box',
                minWidth: "10rem",
                width: "100%",
                boxShadow: "var(--strong-shadow)",
            }}
        >

            <Badge link='/'>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <HomeIcon
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
                        Главная
                    </Typography>
                </Box>
            </Badge>

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

            <Badge link='/control'>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <ControlIcon
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

            <Badge link='/settings'>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <TuneIcon
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
                        Настройки
                    </Typography>
                </Box>
            </Badge>

            <Badge link='/accounts'>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <PeopleIcon
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
                        Аккаунты
                    </Typography>
                </Box>
            </Badge>

            <Badge link='/analytics'>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <AnalyticsIcon
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
                        Аналитика
                    </Typography>
                </Box>
            </Badge>
        </Box >
    );
};


Aside.displayName = 'Aside';
