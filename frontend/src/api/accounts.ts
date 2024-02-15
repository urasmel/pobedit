import { Account, AddAccountDto, LoginAccountDto } from "@/models/account";
import { controlDomain, controlPort, controlProto } from "@/constants/constants";

export const fetchAccounts = async () => {

    const request = new Request(`${controlProto}${controlDomain}:${controlPort}/account/all`,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow',
            cache: 'force-cache'
        });

    const response = await fetch(request);

    if (!response.ok) {
        return null;
    }

    const { data = [] } = await response.json();
    return data;
};

export const addAccount = async (account: AddAccountDto) => {
    const request = new Request(`${controlProto}${controlDomain}:${controlPort}/account/`,
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
            body: JSON.stringify(account),
        });


    const response = await fetch(request);

    if (!response.ok) {
        return null;
    }

    const { data = [] } = await response.json();
    return data;
};

export const deleteAccount = async (id: number) => {
    const request = new Request(`${controlProto}${controlDomain}:${controlPort}/account/${id}`,
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

    const { data = [] } = await response.json();
    return data;
};

export const editAccount = async (account: Account) => {
    const request = new Request(`${controlProto}${controlDomain}:${controlPort}/account/`,
        {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow',
            body: JSON.stringify(account),
        });


    const response = await fetch(request);

    if (!response.ok) {
        return null;
    }

    const { data = [] } = await response.json();
    return data;
};

export const loginAccount = async (account: LoginAccountDto) => {
    const request = new Request(`${controlProto}${controlDomain}:${controlPort}/login`,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow',
            body: JSON.stringify(account),
        });

    const response = await fetch(request);

    if (!response.ok) {
        return null;
    }

    const { data = [] } = await response.json();
    return data;
};
