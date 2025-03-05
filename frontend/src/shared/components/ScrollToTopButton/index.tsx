import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
        // console.log(window.screenY);
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
                <div className={styles['button-up']}>
                    <Button onClick={scrollToTop} fullWidth >
                        <ArrowUpwardIcon />
                    </Button >
                </div>

            )}
        </div>
    );
};

export default ScrollToTopButton;
