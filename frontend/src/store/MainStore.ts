import { Channel } from '@/models/channel';
import { create } from 'zustand';
import { channelDomain, channelPort, channelProto } from '../constants/constants';
import { produce } from 'immer';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { ServiceResponse } from '@/types/ServiceResponse';
import { ChannelFullInfo } from '@/types/ChannelFullInfo';
import { Post } from '@/types/Post';

export interface MainState {

    selectedUser: string;
    channels: Channel[];
    isLoading: boolean;
    error: string;
    isError: boolean;
    channelsInfo: ChannelFullInfo[];
    //channelPostsDict: Record<number, Post[]>[];
    channelPostsDict: {
        channelId: number;
        posts: Post[];
    };
    // Для отображения дополнительной информации о чате.
    selectedChannelFullInfo: ChannelFullInfo;

    setSelectedUser: (username: string) => void;
    fetchChannels: (username: string) => void;
    fetchUpdatedChannels: (username: string) => void;
    fetchChannelInfo: (username: string, channelId: number) => void;
    fetchChannelPosts: (username: string, channelId: number) => void;
    updateSelectedUser: (user: string) => void;
}

export const useMainStore = create<MainState>()(
    devtools(
        immer((set, get) => (
            {
                selectedUser: '',
                channels: [],
                channelsInfo: [],
                channelPostsDict: {
                    channelId: 0,
                    posts: []
                },
                selectedChannelFullInfo: {} as ChannelFullInfo,
                isLoading: false,
                error: '',
                isError: false,
                setSelectedUser: (username: string) => {
                    set({ selectedUser: username });
                },

                fetchChannels: async (username: string) => {
                    const url = `${channelProto}${channelDomain}:${channelPort}/users/${username}/channels`;
                    console.log(url);
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
                    // Попробовать.
                    // set(
                    //     produce((state) => {
                    //         state.chats = [];
                    //     }),
                    // )
                },

                fetchUpdatedChannels: async (username: string) => {
                    const url = `${channelProto}${channelDomain}:${channelPort}/users/${username}/updated_channels`;
                    console.log(url);
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

                updateSelectedUser: async (user: string) => {
                    set({ selectedUser: user });
                },

                fetchChannelInfo: async (username: string, channelId: number) => {

                    if (get().channelsInfo.filter(item => item.channelId === channelId).length === 0) {

                        const request = new Request(`${channelProto}${channelDomain}:${channelPort}/users/${username}/channels/${channelId}/info`,
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
                        set((state) => ({
                            ...state,
                            channelsInfo: [...state.channelsInfo, json]
                        }));
                    }

                    set({ selectedChannelFullInfo: get().channelsInfo[0] });
                },

                fetchChannelPosts: async (username: string, channelId: number) => {

                    const request = new Request(`${channelProto}${channelDomain}:${channelPort}/users/${username}/channels/${channelId}/messages`,
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
                    console.log(channelId);
                    set((state) => ({
                        ...state,
                        //channelsInfo: [...state.channelsInfo, json]
                        //channelPostsDict: { ...state.channelPostsDict, channelId: [...state.channelPostsDict[channelId], ...json] }
                        channelPostsDict: { channelId: channelId, posts: [...json] }
                    }));
                }

            })
        )
    )
);
