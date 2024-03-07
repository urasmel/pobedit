import React from "react";
import styles from "./PostWidget.module.css";
import type { PostProps } from "@/types/Props/PostProps";

const PostWidget = ({ Id, PeerId, MessageDate, Message }: PostProps) => {
    return (
        <div className={styles["widget"]}>
            <div className={styles["widget__header"]}>
                Ид. канала: {PeerId}, ид. сообщения: {Id}, дата:{" "}
                {MessageDate.toLocaleDateString("ru-RU")}
            </div>
            <div className={styles["widget__message-container"]}>
                <div className={styles["widget__message"]}>{Message}</div>
            </div>
        </div>
    );
};

export default PostWidget;
