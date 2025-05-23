import { BadgeProps } from "@/entities/Props/BadgeProps";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

export const Badge = ({ children, link }: BadgeProps) => {
    const navigate = useNavigate();


    return (
        <Box
            sx={{
                width: "100%",
                height: "4vh",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                padding: 1,
                gap: 1,
                cursor: "pointer",
                borderRadius: 1,
                transition: "background-color 0.3s ease, transform 0.3s ease",
                boxSizing: "border-box",
                "&:hover": {
                    backgroundColor: "#e0e0e0",
                    transform: "scale(1.02)",
                },
            }}
            onClick={() => {
                navigate(link);
            }}
        >
            {children}
        </Box>
    );
};
