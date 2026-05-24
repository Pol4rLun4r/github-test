// api
import { baseAPI } from './path';

const minimize = async () => {
    const response = await baseAPI.window.minimize();
    return response;
};

const maximizeToggle = async () => {
    const response = await baseAPI.window.maximizeToggle();
    return response;
};

const close = async () => {
    const response = await baseAPI.window.close();
    return response;
};

export default {minimize, maximizeToggle, close};