import { ServiceResponse, User } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { mapUser } from "./mapper/map-user";
import { UserDto } from "./dto/user.dto";

// export const getUsers = async (page: number, limit: number) => {
//     const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/api/${serviceApiVersion}/users`,
//         {
//             method: 'GET',
//             mode: 'cors',
//             headers: {
//                 'Access-Control-Request-Method': 'GET',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
//             },
//             redirect: 'follow'
//         });

//     const response = await fetch(request);

//     if (!response.ok) {
//         throw new Error('Ошибка загрузки пользователей.');
//     }

//     const response_content = await response.json() as ServiceResponse<UserRow[]>;
//     const data = response_content.data;
//     return data;
// };


export const getUsers = async (): Promise<{ users: User[]; }> => {
    const result = await apiClient.get<ServiceResponse<UserDto[]>>('/users');
    console.log('result is ' + JSON.stringify(result));

    return ({
        users: result.data.map((user: UserDto) => mapUser(user))
    });
};
