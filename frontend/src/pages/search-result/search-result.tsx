import { Box, Pagination, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/entities/search";
import { PostsSearchResults } from "@/features/posts-search-results";
import { CommentsSearchResults } from "@/features/comments-serch-results";
import { PostDto } from "@/entities/posts/api/dto/post.dto";
import { CommentDto } from "@/entities/comments/api/dto/comment.dto";
import { LoadingWidget } from "@/shared/components/loading/loading-widget";
import { useMainStore, MainState, Action } from "@/app/stores";
import { ScrollToTopButton } from "@/shared/components/scroll-top-button";
import { ChangeEvent, useEffect, useState } from "react";
import { PAGE_SIZE } from "@/shared/config";
import { enqueueSnackbar } from "notistack";

export const SearchResultPage = () => {

    const [pagesCount, setPagesCount] = useState(0);
    const [limit] = useState(PAGE_SIZE);
    const searchQuery = useMainStore(
        (state: MainState & Action) => state.searchQuery
    );
    const setSearchQuery = useMainStore(
        (state: MainState & Action) => state.setSearchQuery
    );

    const { data: result,
        isLoading,
        isError }
        = useQuery(searchApi.searchQueries.search(searchQuery));

    const onPageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setSearchQuery({ ...searchQuery, offset: searchQuery.limit * (page - 1) });
    };

    useEffect(
        () => {
            if (result?.totalCount == 0 || result?.totalCount == undefined) {
                return;
            }

            if (result?.totalCount % limit == 0) {
                setPagesCount(result?.totalCount / limit);
            }
            else {
                setPagesCount(Math.ceil(result?.totalCount / limit));
            }
        }, [result?.totalCount]
    );

    useEffect(() => {
        if (isError) {
            enqueueSnackbar("Поиск завершился ошибкой. Попробуйте повторить позже.", { variant: 'error' });
        }
    }, [isError]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    height: "100%",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <LoadingWidget />
            </Box>);
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 2,
                height: "100%",
                boxSizing: "border-box",
            }}
        >
            {/* Search Parameters Summary */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "800px",
                    padding: 2,
                    border: "1px solid #ccc",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Typography variant="body1">Запрос: {searchQuery.query || "N/A"}</Typography>
            </Box>


            {/* Search Results */}
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {result?.data && result.data.length > 0 ? (
                    searchQuery.searchType === "posts" ? (
                        <PostsSearchResults results={result.data as PostDto[]} />
                    ) : (
                        <CommentsSearchResults results={result.data as CommentDto[]} />
                    )
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        Ничего не найдено
                    </Typography>
                )}
            </Box>

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

SearchResultPage.displayName = 'SearchResultPage';
