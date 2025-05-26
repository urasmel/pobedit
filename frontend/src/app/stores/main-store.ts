import { create } from 'zustand';
import { API_URL, ITEMS_PER_PAGE } from '@/shared/config';
import { Channel, ServiceResponse } from '@/entities';
import { Post } from '@/entities';
import { SearchQuery, SearchType } from '@/entities/search/model/search-query';

export interface MainState {
    selectedUser: string | undefined;
    channels: Channel[];
    channelsInfos: Channel[];
    channelPostsDict: {
        channelId: number;
        posts: Post[];
    };
    searchQuery: SearchQuery;
}

export interface Action {
    updateSelectedUser: (username: MainState['selectedUser']) => void;
    fetchUpdatedChannels: () => Promise<void>;
    updateAndFetchChannelPosts: (username: string, channelId: number) => Promise<void>;
    setSearchQuery: (searchQuery: SearchQuery) => void;
}

export const useMainStore = create<MainState & Action>((set, get) => ({
    selectedUser: '',
    channels: [],
    channelsInfos: [],
    channelPostsDict: {
        channelId: 0,
        posts: []
    },
    searchQuery: {
        query: "",
        searchType: SearchType.posts,
        startDate: null,
        endDate: null,
        limit: ITEMS_PER_PAGE,
        offset: 0,
    },

    updateSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },

    fetchUpdatedChannels: async () => {
        const url = `${API_URL}channels/updated_channels`;
        const request = new Request(url,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Request-Method': 'GET',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
                },
                redirect: 'follow',
                cache: 'no-store'
            }
        );

        const response = await fetch(request);

        if (!response.ok) {
            console.error("Ошибка загрузки каналов");
            set((state) => ({
                ...state,
                channels: []
            }));
            return;
        }

        const json = (await response.json() as ServiceResponse<Channel[]>).data;
        // set({ channels: json });
        set((state) => ({
            ...state,
            channels: json
        }));
    },

    updateAndFetchChannelPosts: async (username: string, channelId: number) => {
        const request = new Request(`${API_URL}/info/users/${username}/channels/${channelId}/updated_posts`,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Request-Method': 'GET',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
                },
                redirect: 'follow',
                cache: 'no-store'
            });

        const response = await fetch(request);

        if (!response.ok) {
            console.error("Ошибка загрузки постов канала");
            return;
        }

        const json = (await response.json() as ServiceResponse<Post[]>).data;
        set((state) => ({
            ...state,
            //channelsInfo: [...state.channelsInfo, json]
            //channelPostsDict: { ...state.channelPostsDict, channelId: [...state.channelPostsDict[channelId], ...json] }
            channelPostsDict: { channelId: channelId, posts: [...state.channelPostsDict.posts, ...json] }
        }));
    },

    setSearchQuery: (searchQuery) => {
        set((state) => ({
            ...state,
            searchQuery: searchQuery
        }));
    }
}));
