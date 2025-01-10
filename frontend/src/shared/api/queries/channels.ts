import { API_URL } from "@/shared/config";
import { ChannelInfo, ServiceResponse } from "@/entities";

// export const fetchChannels = async (username: string): Promise<ChannelInfo[]> => {
//     const url = `${API_URL}/info/users/${username}/channels`;
//     const request = new Request(url,
//         {
//             method: 'GET',
//             mode: 'cors',
//             headers: {
//                 'Access-Control-Request-Method': 'GET',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
//             },
//             redirect: 'follow',
//             cache: 'no-store'
//         }
//     );

//     const response = await fetch(request);

//     if (!response.ok) {
//         throw new Error('Ошибка загрузки каналов');
//     }

//     return (await response.json() as ServiceResponse<ChannelInfo[]>).data;
// };

// export const fetchChannelNameById = async (username: string | undefined, channelId: number | undefined): Promise<ChannelInfo | undefined> => {

//     if (username == undefined) {
//         throw new Error("username is undefined");
//     }

//     if (channelId == undefined) {
//         throw new Error("channel id is undefined");
//     }

//     const url = `${API_URL}/info/users/${username}/channels/${channelId}/info`;
//     const request = new Request(url,
//         {
//             method: 'GET',
//             mode: 'cors',
//             headers: {
//                 'Access-Control-Request-Method': 'GET',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
//             },
//             redirect: 'follow',
//             cache: 'no-store'
//         }
//     );

//     const response = await fetch(request);

//     if (!response.ok) {
//         throw new Error('Ошибка загрузки информации о канале по его идентификатору');
//     }

//     const channel = ((await response.json()) as ServiceResponse<ChannelInfo>).data;
//     return channel;
// };
