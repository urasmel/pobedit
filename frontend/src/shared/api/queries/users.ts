import { User, AddUserDto, LoginUserDto as LoginUserDto } from "@/entities/User";
import { serviceApiVersion, serviceDomain, servicePort, serviceProto } from "@/shared/constants";
import { ServiceResponse, UserRow } from "@/entities";

// export const fetchUsers = async () => {
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

export const addUser = async (user: AddUserDto) => {
    const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/users`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow',
            body: JSON.stringify(user),
        });


    const response = await fetch(request);

    if (!response.ok) {
        return null;
    }

    const response_content = await response.json() as ServiceResponse<UserRow>;
    const data = response_content.data;
    return data;
};

export const deleteUser = async (id: number) => {
    const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/users/${id}`,
        {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Request-Method': 'POST',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow'
        });


    const response = await fetch(request);

    if (!response.ok) {
        return null;
    }

    const response_content = await response.json() as ServiceResponse<UserRow>;
    const data = response_content.data;
    return data;
};

export const editUser = async (user: User) => {
    const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/users`,
        {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow',
            body: JSON.stringify(user),
        });


    const response = await fetch(request);

    if (!response.ok) {
        return null;
    }

    const response_content = await response.json() as ServiceResponse<UserRow>;
    const data = response_content.data;
    return data;
};

export const loginUser = async (user: LoginUserDto) => {
    const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/auth/login`,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow',
            body: JSON.stringify(user),
        });

    const response = await fetch(request);

    if (!response.ok) {
        return null;
    }

    const { data = [] } = await response.json();
    return data;
};
