import { create } from 'zustand';
import { serviceDomain, servicePort, serviceProto, channelApiVersion } from '../constants';
import { ServiceResponse } from '@/types';
import { ChannelInfo } from '@/types';
import { Post } from '@/types';

export interface MainState {
    selectedUser: string | null;
    channels: ChannelInfo[];
    isLoading: boolean;
    error: string;
    isError: boolean;
    channelsInfos: ChannelInfo[];
    channelPostsDict: {
        channelId: number;
        posts: Post[];
    };
    // Для отображения дополнительной информации о чате.
    selectedChannelInfo: ChannelInfo;
}

export interface Action {
    updateSelectedUser: (username: MainState['selectedUser']) => void;
    fetchUpdatedChannels: (username: string) => Promise<void>;
    fetchChannelInfo: (channelId: number) => Promise<boolean>;
    fetchChannelPosts: (username: string, channelId: number, offset: number, count: number) => Promise<boolean>;
    updateAndFetchChannelPosts: (username: string, channelId: number) => Promise<void>;
}

export const useMainStore = create<MainState & Action>((set, get) => ({
    selectedUser: '',
    channels: [],
    channelsInfos: [],
    channelPostsDict: {
        channelId: 0,
        posts: []
    },
    selectedChannelInfo: {} as ChannelInfo,
    isLoading: false,
    error: '',
    isError: false,

    updateSelectedUser: (selectedUser) => {
        console.log("mainstore user setting: " + selectedUser);
        set({ selectedUser });
    },

    fetchUpdatedChannels: async (username: string) => {
        const url = `${serviceProto}${serviceDomain}:${servicePort}/api/${channelApiVersion}/info/users/${username}/updated_channels`;
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
            console.log("Error fetching channels");
            set((state) => ({
                ...state,
                channels: []
            }));
            return;
        }

        const json = (await response.json() as ServiceResponse<ChannelInfo[]>).data;
        // set({ channels: json });
        set((state) => ({
            ...state,
            channels: json
        }));
    },

    fetchChannelInfo: async (channelId: number) => {

        if (get().selectedUser == null) {
            return false;
        }

        const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/api/${channelApiVersion}/info/users/${get().selectedUser}/channels/${channelId}/info`,
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
            console.log("Error requesting channelinfo");
            return false;
        }

        const json = (await response.json() as ServiceResponse<ChannelInfo>).data;
        set(() => ({ selectedChannelInfo: json }));
        return true;
    },

    fetchChannelPosts: async (username: string, channelId: number, offset = 0, count = 20) => {

        try {
            const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/api/${channelApiVersion}/info/users/${username}/channels/${channelId}/messages?offset=${offset}&count=${count}`,
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
                console.log("Error requesting channel's posts!!!!!!");
                return false;
            }

            const json = (await response.json() as ServiceResponse<Post[]>).data;
            set((state) => ({
                ...state,
                channelPostsDict: { channelId: channelId, posts: [...state.channelPostsDict.posts, ...json] }
            }));
            return true;
        } catch (error) {
            return false;
        }
    },

    updateAndFetchChannelPosts: async (username: string, channelId: number) => {
        const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/api/${channelApiVersion}/info/users/${username}/channels/${channelId}/updated_messages`,
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
            console.log("Error requesting channel's posts");
            return;
        }

        const json = (await response.json() as ServiceResponse<Post[]>).data;
        set((state) => ({
            ...state,
            //channelsInfo: [...state.channelsInfo, json]
            //channelPostsDict: { ...state.channelPostsDict, channelId: [...state.channelPostsDict[channelId], ...json] }
            channelPostsDict: { channelId: channelId, posts: [...state.channelPostsDict.posts, ...json] }
        }));
    }
}));
