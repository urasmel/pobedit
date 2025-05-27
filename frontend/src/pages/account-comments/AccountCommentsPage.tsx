import { accountApi } from '@/entities/account';
import { commentsApi } from '@/entities/comments';
import { ScrollToTopButton } from '@/shared/components/scroll-top-button';
import { Box, Typography, Avatar, List, ListItem, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ITEMS_PER_PAGE } from '@/shared/config';
import { CommentInfo } from '@/shared/components/Comments/comment-info';

export const AccountCommentsPage = () => {

    const { accountId } = useParams();
    const [pagesCount, setPagesCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(ITEMS_PER_PAGE);

    const { data: count } = useQuery(commentsApi.commentsQueries.allAccountCommentsCount(accountId));

    useEffect(
        () => {
            if (count == 0 || count == undefined) {
                return;
            }

            if (count % limit == 0) {
                setPagesCount(count / limit);
            }
            else {
                setPagesCount(Math.ceil(count / limit));
            }
        }, [count]
    );

    const {
        data: account,
        isError,
    } = useQuery(accountApi.accountsQueries.one(accountId));

    const {
        data: comments,
    } = useQuery(commentsApi.commentsQueries.allAccountComments(accountId, offset, limit));

    const onPageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setOffset(limit * (page - 1));
    };

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
        }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 3,
                    padding: 2,
                    backgroundColor: 'primary.light',
                    borderRadius: 2,
                    gap: 2,
                }}
            >

                <NavLink
                    to={`/accounts/${accountId}`}
                >
                    {
                        account?.photo
                            ?
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    cursor: "pointer",
                                }}
                                alt="User Avatar"
                                src={`data:image/jpeg;base64,${account?.photo}`}
                            />
                            :
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    cursor: "pointer",
                                }}
                                alt="User Avatar"
                                src={`${import.meta.env.BASE_URL}ava.png`}
                            />
                    }
                </NavLink>


                <Typography variant="h5">{account?.username}</Typography>

            </Box>

            {/* Comments List */}
            <Typography variant="h6" gutterBottom>
                Комментарии пользователя
            </Typography>

            <List>
                {comments?.map((comment) => (
                    <ListItem
                        key={comment.tlgId}
                        sx={{ marginBottom: 2 }}
                    >
                        <CommentInfo comment={comment} showUsername={false} showChannel={true} />
                    </ListItem>
                ))}
            </List>

            {
                !isError &&
                <Pagination
                    sx={{ marginTop: 'auto' }}
                    count={pagesCount}
                    variant="outlined"
                    shape="rounded"
                    onChange={onPageChange}
                />
            }

            <ScrollToTopButton />
        </Box>
    );
};
