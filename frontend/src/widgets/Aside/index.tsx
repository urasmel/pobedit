
import styles from './styles.module.css';
import Badge from '@/shared/components/Badge';
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Typography } from '@mui/material';

export const Aside = () => {
    return (
        <aside className={styles.aside}>
            <Badge title='Поиск' link='/search'>
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

            <Badge title='Управление' link='/admin'>
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
        </aside>
    );
};
