import { Channel } from '@/models/channel';
import { create } from 'zustand';
import { channelDomain, channelPort, channelProto, channelApiVersion } from '../constants';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { ServiceResponse } from '@/types';
import { ChannelFullInfo } from '@/types';
import { Post } from '@/types';

export interface MainState {

    selectedUser: string | null;
    channels: Channel[];
    isLoading: boolean;
    error: string;
    isError: boolean;
    channelsInfos: ChannelFullInfo[];
    channelPostsDict: {
        channelId: number;
        posts: Post[];
    };
    // Для отображения дополнительной информации о чате.
    selectedChannelFullInfo: ChannelFullInfo;

    setSelectedUser: (username: string) => void;
    fetchUpdatedChannels: (username: string) => Promise<void>;
    fetchChannelInfo: (username: string | null, channelId: number) => Promise<void>;
    fetchChannelPosts: (username: string, channelId: number, offset: number, count: number) => Promise<boolean>;
    updateAndFetchChannelPosts: (username: string, channelId: number) => Promise<void>;
    updateSelectedUser: (user: string) => void;
}

export const useMainStore = create<MainState>()(
    devtools(
        immer((set, get) => (
            {
                selectedUser: '',
                channels: [],
                channelsInfos: [],
                channelPostsDict: {
                    channelId: 0,
                    posts: []
                },
                selectedChannelFullInfo: {} as ChannelFullInfo,
                isLoading: false,
                error: '',
                isError: false,

                setSelectedUser: (username: string) => {
                    console.log("set user: " + username);
                    // set({ selectedUser: username });

                    set((state) => ({
                        ...state,
                        selectedUser: username
                    }));
                    console.log("user is: " + get().selectedUser);
                },

                fetchUpdatedChannels: async (username: string) => {
                    const url = `${channelProto}${channelDomain}:${channelPort}/api/${channelApiVersion}/info/users/${username}/updated_channels`;
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
                        set({ channels: [] });
                        return;
                    }

                    const json = (await response.json() as ServiceResponse<Channel[]>).data;
                    set({ channels: json });
                },

                updateSelectedUser: (username: string) => {
                    //set({ selectedUser: username });
                    console.log("update user: " + username);
                    set({ selectedUser: username });
                },

                fetchChannelInfo: async (username: string | null, channelId: number) => {

                    if (username == null) {
                        return;
                    }

                    console.log("fetching user is: " + username);

                    if (get().channelsInfos.filter(item => item.id === channelId).length === 0) {

                        const request = new Request(`${channelProto}${channelDomain}:${channelPort}/api/${channelApiVersion}/info/users/${username}/channels/${channelId}/info`,
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
                            return;
                        }

                        const json = (await response.json() as ServiceResponse<ChannelFullInfo>).data;
                        // set((state) => ({
                        //     ...state,
                        //     channelsInfo: [...state.channelsInfos, json]
                        // }));
                        set({
                            channelsInfos: [...get().channelsInfos, json]
                        });
                    }

                    //set({ selectedChannelFullInfo: get().channelsInfos[0] });
                    set({ selectedChannelFullInfo: get().channelsInfos.filter(item => item.id === channelId)[0] });
                    console.log(get().channelsInfos);
                },

                fetchChannelPosts: async (username: string, channelId: number, offset = 0, count = 20) => {

                    try {
                        const request = new Request(`${channelProto}${channelDomain}:${channelPort}/api/${channelApiVersion}/info/users/${username}/channels/${channelId}/messages?offset=${offset}&count=${count}`,
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
                    const request = new Request(`${channelProto}${channelDomain}:${channelPort}/api/${channelApiVersion}/info/users/${username}/channels/${channelId}/updated_messages`,
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
                },

            })
        )
    )
);
