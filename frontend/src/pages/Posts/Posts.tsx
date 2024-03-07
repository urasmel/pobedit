import styles from "./styles.module.scss";
import { Aside } from "components/blocks/Aside/Aside";
import { Main } from "components/blocks/Main/Main";
import { PostsProps } from "@/types/Props/PostsProps";
import { useEffect } from "react";

const Posts = ({ user, chatId }: PostsProps) => {
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await fetchUsers();
    //         if (data) {
    //             setUsers(data);
    //         }
    //     };

    //     fetchData();
    // }, []);

    return (
        <div className={styles["main_container"]}>
            <Aside></Aside>
            <Main></Main>
        </div>
    );
};

export default Posts;
