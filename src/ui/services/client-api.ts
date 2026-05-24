// api
import { baseAPI } from "./path";

const search = async (query: SearchClient) => {
    const response = await baseAPI.client.search(query);
    return response;
};

const create = async (data: Client) => {
    const response = await baseAPI.client.create(data);
    return response;
};

export default { search, create };