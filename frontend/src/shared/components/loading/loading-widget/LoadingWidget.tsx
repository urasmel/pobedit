import { Box, CircularProgress, SxProps, Theme } from "@mui/material";
import { CSSProperties } from "react";

interface LoadingWidgetProps {
    /** Размер индикатора загрузки */
    size?: number | string;
    /** Цвет индикатора */
    color?: "primary" | "secondary" | "inherit" | "success" | "error" | "info" | "warning";
    /** Вариант отображения: центрированный или inline */
    centered?: boolean;
    /** Занимать всю высоту родительского контейнера */
    fullHeight?: boolean;
    /** Дополнительные стили */
    sx?: SxProps<Theme>;
    /** Дополнительные inline-стили */
    style?: CSSProperties;
    /** Текст под индикатором */
    text?: string;
    /** Размер текста */
    textSize?: "small" | "medium" | "large";
}

export const LoadingWidget = ({
    size = 100,
    color = "primary",
    centered = true,
    fullHeight = false,
    sx,
    style,
    text,
    textSize = "medium"
}: LoadingWidgetProps) => {
    // Базовые стили контейнера
    const containerStyles: SxProps<Theme> = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: text ? 1 : 0,
        ...(centered && {
            width: "100%",
            height: "100%",
        }),
        ...(!centered && {
            width: "100%",
            padding: 3,
        }),
        ...(fullHeight && {
            minHeight: "100vh",
        }),
        ...sx,
    };

    // Стили для индикатора загрузки
    const progressContainerStyles: SxProps<Theme> = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        maxWidth: "100%",
        aspectRatio: "1 / 1",
    };

    // Размеры текста в зависимости от пропса
    const textVariant = {
        small: "body2",
        medium: "body1",
        large: "h6"
    }[textSize];

    return (
        <Box sx={containerStyles} style={style}>
            <Box sx={progressContainerStyles}>
                <CircularProgress
                    size="100%"
                    color={color}
                    thickness={4}
                />
            </Box>

            {text && (
                <Box
                    component="span"
                    sx={{
                        typography: textVariant,
                        color: "text.secondary",
                        textAlign: "center",
                        maxWidth: "200px"
                    }}
                >
                    {text}
                </Box>
            )}
        </Box>
    );
};

LoadingWidget.displayName = 'LoadingWidget';
