import { Box } from "@mui/material"; import { Comment } from '@/entities/comments/model/comment';
import { NavLink } from "react-router-dom";
import { AccountAvatar } from "../../account-avatar";


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
                <AccountAvatar account={props.comment.from} onClick={() => { }} />
            </NavLink>
        </Box>
    );
};
