import styles from "./styles.module.css";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { BadgeProps } from "@/entities/Props/BadgeProps";
import { useNavigate } from "react-router-dom";

const Badge = ({ title, active, link }: BadgeProps) => {
    const navigate = useNavigate();
    let badgeActive = "";
    let badgeIconActive = "";
    let badgeTitleActive = "";

    if (active) {
        badgeActive = "badge--active";
        badgeIconActive = "badge__icon--active";
        badgeTitleActive = "badge__title--active";
    }

    return (
        <div className={`${styles.badge} ${styles[badgeActive]}`} onClick={() => { navigate(link); }}>
            <div
                className={`${styles.badge__icon} ${styles[badgeIconActive]}`}
            >
                <PeopleAltIcon sx={{ fontSize: 12, fill: "#344767" }} />
            </div>
            <div
                className={`${styles.badge__title} ${styles[badgeTitleActive]}`}
            >
                {title}
            </div>
        </div>
    );
};

export default Badge;
