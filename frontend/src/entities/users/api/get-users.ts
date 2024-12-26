import { serviceApiVersion, serviceDomain, servicePort, serviceProto } from "@/shared/constants";
import { ServiceResponse, UserRow } from "@/entities";
import { apiClient } from "@/shared/api/base";

import { PostWithPaginationDto } from "./dto/post-with-pagination.dto";
import { PostQuery } from "./query/post.query";
import { mapPost } from "./mapper/map-post";
import { PostWithPagination } from "../model/post-with-pagination";

export const getUsers = async (page: number, limit: number) => {
    const request = new Request(`${serviceProto}${serviceDomain}:${servicePort}/api/${serviceApiVersion}/users`,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Options'
            },
            redirect: 'follow'
        });

    const response = await fetch(request);

    if (!response.ok) {
        throw new Error('Ошибка загрузки пользователей.');
    }

    const response_content = await response.json() as ServiceResponse<UserRow[]>;
    const data = response_content.data;
    return data;
};



const calculatePostPage = (totalCount: number, limit: number) => Math.floor(totalCount / limit);

export const getPosts = async (page: number, limit: number): Promise<PostWithPagination> => {
    const skip = page * limit;
    const query: PostQuery = { skip, limit };
    const result = await apiClient.get<PostWithPaginationDto>('/posts', query);

    return ({
        posts: result.posts.map(post => mapPost(post)),
        limit: result.limit,
        skip: result.skip,
        total: result.total,
        totalPages: calculatePostPage(result.total, limit)
    });
};
