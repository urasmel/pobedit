import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        // const inner = document.getElementById('inner');
        // console.log(window.document.body.offsetTop - window.document.body.scrollTop);
        if (window.document.body.scrollTop > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
        console.log(window.document.body.scrollTop);
    };

    const scrollToTop = () => {
        window.document.body.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        console.log("!!!!");
        // document.body.addEventListener('scroll', toggleVisibility);
        document.addEventListener('scroll', toggleVisibility);
        return () => {
            // document.body.removeEventListener('scroll', toggleVisibility);
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
