import { Chat } from '../models/chat';
import { create } from 'zustand';
import { chatDomain, chatPort, chatProto } from '../constants/constants';
import { produce } from 'immer';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { ServiceResponse } from '../types/serviceResponse';
import { ChatFullInfo } from '../types/ChatFullInfo';

export interface MainState {
    selectedAccount: string;
    chats: Chat[];
    isLoading: boolean;
    error: string;
    isError: boolean;
    chatsInfo: ChatFullInfo[];
    // Для отображения дополнительной информации о чате.
    selectedChatFullInfo: ChatFullInfo;
    setSelectedAccount: (username: string) => void;
    fetchChats: (username: string) => void;
    fetchChatInfo: (username: string, chatId: number) => void;
    updateSelectedAccount: (account: string) => void;
}

export const useMainStore = create<MainState>()(
    devtools(
        immer((set, get) => (
            {
                selectedAccount: '',
                chats: [],
                chatsInfo: [],
                selectedChatFullInfo: {} as ChatFullInfo,
                isLoading: false,
                error: '',
                isError: false,
                setSelectedAccount: (username: string) => {
                    set({ selectedAccount: username });
                },

                fetchChats: async (username: string) => {
                    const request = new Request(`${chatProto}${chatDomain}:${chatPort}/${username}/all_chats`,
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
                        console.log("Error fetching chats");
                        set({ chats: [] });
                        return;
                    }

                    const json = (await response.json() as ServiceResponse<Chat[]>).data;
                    set({ chats: json });
                    // Попробовать.
                    // set(
                    //     produce((state) => {
                    //         state.chats = [];
                    //     }),
                    // )
                },

                updateSelectedAccount: async (account: string) => {
                    set({ selectedAccount: account });
                },

                fetchChatInfo: async (username: string, chatId: number) => {

                    if (get().chatsInfo.filter(item => item.chatId === chatId).length === 0) {

                        const request = new Request(`${chatProto}${chatDomain}:${chatPort}/${username}/ChatInfo/${chatId}`,
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
                            console.log("Error requesting chatinfo");
                            return;
                        }

                        const json = (await response.json() as ServiceResponse<ChatFullInfo>).data;
                        //set({ chatsInfo: chatsInfo.push(json) });
                        set((state) => ({
                            ...state,
                            chatsInfo: [...state.chatsInfo, json]
                        }));
                    }

                    //await new Promise(() => setTimeout(() => { }, 100));
                    //console.log(get().chatsInfo.filter(item => item.chatId === chatId)[0]);
                    set({ selectedChatFullInfo: get().chatsInfo.filter(item => item.chatId === chatId)[0] });
                }
            })
        )
    )
);
