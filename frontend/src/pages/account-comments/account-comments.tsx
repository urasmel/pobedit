// import { accountApi } from '@/entities/account';
// import { commentsApi } from '@/entities/comments';
// import { ScrollToTopButton } from '@/shared/components/scroll-top-button';
// import { Box, Typography, List, ListItem, Pagination } from '@mui/material';
// import { useQuery } from '@tanstack/react-query';
// import { ChangeEvent, useEffect, useState } from 'react';
// import { NavLink, useParams } from 'react-router-dom';
// import { PAGE_SIZE } from '@/shared/config';
// import { CommentInfo } from '@/shared/components/Comments/comment-info';
// import { AccountAvatar } from '@/shared/components/account-avatar';

// export const AccountComments = () => {

//     const { accountId } = useParams();
//     const [pagesCount, setPagesCount] = useState(0);
//     const [offset, setOffset] = useState(0);
//     const [limit] = useState(PAGE_SIZE);

//     const { data: count } = useQuery(commentsApi.commentsQueries.allAccountCommentsCount(accountId));

//     useEffect(
//         () => {
//             if (count == 0 || count == undefined) {
//                 return;
//             }

//             if (count % limit == 0) {
//                 setPagesCount(count / limit);
//             }
//             else {
//                 setPagesCount(Math.ceil(count / limit));
//             }
//         }, [count]
//     );

//     const {
//         data: account,
//         isError,
//     } = useQuery(accountApi.accountsQueries.one(accountId));

//     const {
//         data: comments,
//     } = useQuery(commentsApi.commentsQueries.allAccountComments(accountId, offset, limit));

//     const onPageChange = (_event: ChangeEvent<unknown>, page: number) => {
//         setOffset(limit * (page - 1));
//     };

//     return (
//         <Box sx={{
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             boxSizing: 'border-box'
//         }}>
//             {/* Header Section */}
//             <Box
//                 sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     marginBottom: 3,
//                     padding: 2,
//                     backgroundColor: 'primary.light',
//                     borderRadius: "var(--radius-md)",
//                     gap: 2,
//                 }}
//             >

//                 <NavLink
//                     to={`/accounts/${accountId}`}
//                 >
//                     <AccountAvatar account={account} onClick={() => { }} />
//                 </NavLink>

//                 <Typography variant="h5">{account?.first_name}</Typography>

//             </Box>

//             {/* Comments List */}
//             <Typography variant="h6" gutterBottom>
//                 Комментарии пользователя
//             </Typography>

//             <List>
//                 {comments?.map((comment) => (
//                     <ListItem
//                         key={comment.tlgId}
//                         sx={{ marginBottom: 2 }}
//                     >
//                         <CommentInfo comment={comment} showUsername={false} showChannel={true} showPostLink={true} />
//                     </ListItem>
//                 ))}
//             </List>

//             {
//                 !isError &&
//                 <Pagination
//                     sx={{ marginTop: 'auto' }}
//                     count={pagesCount}
//                     variant="outlined"
//                     shape="rounded"
//                     onChange={onPageChange}
//                 />
//             }

//             <ScrollToTopButton />
//         </Box>
//     );
// };


import { accountApi } from '@/entities/account';
import { commentsApi } from '@/entities/comments';
import { ScrollToTopButton } from '@/shared/components/scroll-top-button';
import { PAGE_SIZE } from '@/shared/config';
import { Box, Typography, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccountHeader, CommentsList } from './ui';

export const AccountComments = () => {
    const { accountId } = useParams();

    // Валидация параметра
    if (!accountId) {
        return (
            <Box sx={{ padding: 4 }}>
                <Typography variant="h6" color="error">
                    ID аккаунта не указан
                </Typography>
            </Box>
        );
    }

    // Запросы данных
    const { data: count = 0 } = useQuery(
        commentsApi.commentsQueries.allAccountCommentsCount(accountId)
    );

    const { data: account, isError: isAccountError } = useQuery(
        accountApi.accountsQueries.one(accountId)
    );

    // Пагинация
    const [offset, setOffset] = useState(0);
    const limit = PAGE_SIZE;

    const pagesCount = useMemo(() => {
        if (!count) return 0;
        return Math.ceil(count / limit);
    }, [count, limit]);

    const { data: comments = [] } = useQuery(
        commentsApi.commentsQueries.allAccountComments(accountId, offset, limit)
    );

    // Обработчики
    const handlePageChange = useCallback((_event: ChangeEvent<unknown>, page: number) => {
        setOffset(limit * (page - 1));
    }, [limit]);

    const handleAvatarClick = useCallback(() => {
        // Можно добавить логику, например, открытие модалки
    }, []);

    // Состояния загрузки и ошибок
    const isLoading = !comments || !account;
    const isEmpty = comments.length === 0;

    if (isAccountError) {
        return (
            <Box sx={{ padding: 4 }}>
                <Typography variant="h6" color="error">
                    Ошибка загрузки данных аккаунта
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={containerStyles}>
            {/* Хедер аккаунта */}
            <AccountHeader
                accountId={accountId}
                account={account}
                onAvatarClick={handleAvatarClick}
            />

            {/* Заголовок секции */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Комментарии пользователя
                {count > 0 && (
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({count} всего)
                    </Typography>
                )}
            </Typography>

            {/* Список комментариев */}
            <CommentsList
                comments={comments}
                isLoading={isLoading}
                isEmpty={isEmpty}
            />

            {/* Пагинация */}
            {pagesCount > 1 && (
                <Pagination
                    sx={paginationStyles}
                    count={pagesCount}
                    variant="outlined"
                    shape="rounded"
                    onChange={handlePageChange}
                />
            )}

            <ScrollToTopButton />
        </Box>
    );
};

const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    py: 2,
    px: { xs: 1, sm: 2, md: 3 } // Адаптивные отступы
};


const paginationStyles = {
    marginTop: 'auto',
    py: 2,
    display: 'flex',
    justifyContent: 'center'
};
