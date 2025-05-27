import { PostWidget } from "../post-widget";
import { Post } from "@/entities";

export const PostsSearchResults = (props: { results: Post[]; }) => {
    return (props.results.map((post: Post) => (
        <PostWidget
            post={post}
            showPostLink={true}
            showTitle={true}
            key={post.tlgId}
        />
    )));
};
