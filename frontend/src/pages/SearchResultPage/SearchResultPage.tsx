import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/entities/search";
import { PostsSearchResults } from "@/features/PostsSearchResults";
import { CommentsSearchResults } from "@/features/CommentsSerchResults";
import { PostDto } from "@/entities/posts/api/dto/post.dto";
import { CommentDto } from "@/entities/comments/api/dto/comment.dto";
import Loading from "@/shared/components/Loading";
import { useMainStore, MainState, Action } from "@/app/stores";

export const SearchResultPage = () => {

    const searchQuery = useMainStore(
        (state: MainState & Action) => state.searchQuery
    );

    const { data: results,
        isLoading }
        = useQuery(searchApi.searchQueries.search(searchQuery));

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
                {results && results.length > 0 ? (
                    searchQuery.searchType === "posts" ? (
                        <PostsSearchResults results={results as PostDto[]} />
                    ) : (
                        <CommentsSearchResults results={results as CommentDto[]} />
                    )
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        Ничего не найдено
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
