import { Logo } from '@/shared/components/logo';
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, useTheme, SxProps, Theme } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { ReactNode } from 'react';

interface HeaderProps {
    showBackButton?: boolean;
    backButtonText?: string;
    backButtonFallbackPath?: string;
    rightContent?: ReactNode;
    logoLink?: string;
    sx?: SxProps<Theme>;
}

export const Header = ({
    showBackButton = true,
    backButtonText = "Назад",
    backButtonFallbackPath = "/",
    rightContent,
    logoLink = "/",
    sx = {}
}: HeaderProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(backButtonFallbackPath);
        }
    };

    return (
        <Box
            component="header"
            sx={[
                {
                    position: "sticky",
                    top: 0,
                    zIndex: theme.zIndex.appBar,
                    height: { xs: "4rem", sm: "3.5rem" },
                    boxShadow: theme.shadows[2],
                    color: theme.palette.text.primary,
                    borderRadius: theme.shape.borderRadius,
                    padding: theme.spacing(1, 2),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    marginBottom: theme.spacing(2),
                    backdropFilter: "blur(8px)",
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {/* Логотип */}
            <Box
                component={Link}
                to={logoLink}
                sx={{
                    width: "2rem",
                    height: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    color: "inherit",
                    transition: theme.transitions.create('opacity'),
                    '&:hover': {
                        opacity: 0.7,
                    }
                }}
                aria-label="На главную страницу"
            >
                <Logo />
            </Box>

            {/* Правая часть */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {rightContent}

                {showBackButton && (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ArrowBack />}
                        onClick={handleGoBack}
                        sx={{
                            fontWeight: 500,
                            textTransform: 'none',
                            borderRadius: theme.shape.borderRadius,
                            minWidth: 'auto',
                        }}
                    >
                        {backButtonText}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

Header.displayName = 'Header';
