import { Box, Avatar } from "@mui/material"; import { Comment } from '@/entities/comments/model/comment';
import { NavLink } from "react-router-dom";


export const CommentAva = (props: { comment: Comment; }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "start",
                paddingLeft: 1,
            }}
        >
            <NavLink
                to={`/accounts/${props.comment.from.tlg_id}`}
            >
                {
                    props.comment.from.photo !== null ?
                        <Avatar
                            sx={{ width: 56, height: 56 }}
                            alt="User Avatar"
                            src={`data:image/jpeg;base64,${props.comment.from.photo}`}
                        />
                        :
                        <Avatar
                            sx={{ width: 56, height: 56 }}
                            alt="User Avatar"
                            src={`${import.meta.env.BASE_URL}ava.png`}
                        />
                }
            </NavLink>
        </Box>
    );
};
