import { BadgeProps } from "@/entities/Props/BadgeProps";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const Badge = ({ children, link }: BadgeProps) => {
    const navigate = useNavigate();


    return (
        <Box
            sx={{
                width: "200px",
                height: "2vh",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start", // Align content to the left
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                padding: 2,
                gap: 1,
                cursor: "pointer",
                borderRadius: 1,
                transition: "background-color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                    backgroundColor: "#e0e0e0", // Change background color on hover
                    transform: "scale(1.02)", // Slightly scale up on hover
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

export default Badge;
