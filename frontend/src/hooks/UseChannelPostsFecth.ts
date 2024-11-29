import { fetchChannelPosts } from '@/api/posts';
import { Post, Status } from '@/types';
import { useState, useEffect } from 'react';

const UseChannelPostsFetch = (user: string | undefined, channelId: string | undefined) => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [postsLoading, setPostsLoading] = useState<Status>('Before');
    const [postsLoadingError, setPostsLoadingError] = useState(false);
    const [offset, setOffset] = useState(0);
    const [count, setCount] = useState(20);

    useEffect(() => {

        const fetchData = async () => {

            if (user == undefined || channelId == undefined) {
                setPostsLoadingError(true);
                console.error('Undefined param in UseChannelPostsFetching');
                return;
            }

            setPostsLoading('Processing');
            try {
                const fetchedPosts = await fetchChannelPosts(
                    user,
                    parseInt(channelId),
                    offset,
                    count);
                setPosts(posts => [...posts, ...fetchedPosts]);
            } catch (error) {
                let message;
                if (error instanceof Error) message = error.message;
                else message = String(error);
                console.error(message);
                setPostsLoadingError(true);
            } finally {
                setPostsLoading('After');
            }
        };

        fetchData();
    }, [user, channelId, offset]);

    return { posts, postsLoading, postsLoadingError, setOffset };
};

export default UseChannelPostsFetch;
