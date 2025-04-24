import { PostDto } from "@/entities/posts/api/dto/post.dto";
import { PostSearchWidget } from "../PostSearchWidget";

export const PostsSearchResults = (props: { results: PostDto[]; }) => {
    return (props.results.map((post: PostDto, index: number) => (
        <PostSearchWidget index={index} post={post} />
    )));
};
