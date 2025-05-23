import { Box, Pagination, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/entities/search";
import { PostsSearchResults } from "@/features/PostsSearchResults";
import { CommentsSearchResults } from "@/features/CommentsSerchResults";
import { PostDto } from "@/entities/posts/api/dto/post.dto";
import { CommentDto } from "@/entities/comments/api/dto/comment.dto";
import { Loading } from "@/shared/components/Loading";
import { useMainStore, MainState, Action } from "@/app/stores";
import { ScrollToTopButton } from "@/shared/components/ScrollToTopButton/ScrollToTopButton";
import { ChangeEvent, useEffect, useState } from "react";
import { ITEMS_PER_PAGE } from "@/shared/config";

export const SearchResultPage = () => {

    const [pagesCount, setPagesCount] = useState(0);
    const [limit] = useState(ITEMS_PER_PAGE);
    const searchQuery = useMainStore(
        (state: MainState & Action) => state.searchQuery
    );
    const setSearchQuery = useMainStore(
        (state: MainState & Action) => state.setSearchQuery
    );

    const { data: result,
        isLoading, isError }
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

    if (isLoading) {
        return (<Loading />);
    }

    return (
        <Box
            sx={{
                padding: 4,
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
                    borderRadius: 2,
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
