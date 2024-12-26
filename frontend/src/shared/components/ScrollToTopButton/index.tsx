import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.document.body.scrollTop > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.document.body.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        document.body.addEventListener('scroll', toggleVisibility);
        return () => {
            document.body.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <div className={styles['button-up']}>
                    <Button onClick={scrollToTop} fullWidth >
                        <ArrowUpwardIcon />
                    </Button >
                </div>

            )}
        </>
    );
};

export default ScrollToTopButton;
