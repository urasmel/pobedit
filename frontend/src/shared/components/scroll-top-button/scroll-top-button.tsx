import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        document.addEventListener('scroll', toggleVisibility);
        return () => {
            document.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div>
            {isVisible && (
                <Box sx={{
                    position: "fixed",
                    bottom: "5rem",
                    right: "2rem",
                    backgroundColor: "#f1f1f1",
                    border: "none",
                    borderRadius: ".25rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)"
                }}>
                    <Button onClick={scrollToTop} fullWidth >
                        <ArrowUpwardIcon />
                    </Button >
                </Box>

            )}
        </div>
    );
};
