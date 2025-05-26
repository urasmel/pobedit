import { Box } from "@mui/material";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const LoadingWidget = () => {
    const spinnerRef = useRef(null);

    useEffect(() => {
        const rotationAnimation = gsap.to(spinnerRef.current, {
            rotation: 360,
            repeat: -1,
            duration: 1,
            ease: "linear",
        });

        return () => {
            rotationAnimation.kill();
        };
    }, []);

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
        }}>
            <div
                ref={spinnerRef}
                style={{
                    width: '4rem',
                    height: '4rem',
                    border: '1rem solid #ccc',
                    borderTop: '1rem solid #3498db',
                    borderRadius: '50%',
                    display: 'inline-block',
                }}
            ></div>
        </Box>
    );
};
