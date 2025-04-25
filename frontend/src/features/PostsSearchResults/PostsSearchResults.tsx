import { PostWidget } from "../PostWidget";
import { Post } from "@/entities";

export const PostsSearchResults = (props: { results: Post[]; }) => {
    return (props.results.map((post: Post) => (
        <PostWidget post={post} />
    )));
};
