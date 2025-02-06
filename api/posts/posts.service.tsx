import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api, { request_headers } from '../axios.config'; // importing axios from customAxios
import { environment } from '../../environments/environment.config';


class PostService {

    list() {
        return api.get(`/posts`);
    }

    getById(id: string) {
        return api.get(`/posts/${id}`);
    }

    add(id: string, data:any) {
        return api.post(`/posts`, data);
    }

    update(id: string, data:any) {
        return api.put(`/posts/${id}`, data);
    }

    remove(id: string) {
        return api.delete(`/posts/${id}`);
    }

    async getConfigPostData(): Promise<any> {
        return AsyncStorage.getItem(environment.storageKeys.configPost)
        .then((json: any) => {
            return JSON.parse(json) as any;
        });
    }

    async saveConfigPostData(item: any): Promise<void> {
        return AsyncStorage.setItem(environment.storageKeys.configPost, JSON.stringify(item));
    }

    async removeConfigPostData(): Promise<void> {
        AsyncStorage.removeItem(environment.storageKeys.configPost);
    }
}

const postService = new PostService();
export {postService};