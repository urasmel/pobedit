import React from "react";
import styles from "./Badge.module.css";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { BadgeProps } from "@/types/Props/BadgeProps";

const Badge: React.FC<BadgeProps> = ({ title, active }) => {
    let badgeActive: string = "";
    let badgeIconActive: string = "";
    let badgeTitleActive: string = "";

    if (active) {
        badgeActive = "badge--active";
        badgeIconActive = "badge__icon--active";
        badgeTitleActive = "badge__title--active";
    }

    return (
        <div className={`${styles["badge"]} ${styles[badgeActive]}`}>
            <div
                className={`${styles["badge__icon"]} ${styles[badgeIconActive]}`}
            >
                <PeopleAltIcon sx={{ fontSize: 12, fill: "#344767" }} />
            </div>
            <div
                className={`${styles["badge__title"]} ${styles[badgeTitleActive]}`}
            >
                {title}
            </div>
        </div>
    );
};

export default Badge;
