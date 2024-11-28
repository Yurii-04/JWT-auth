import api from "../http";
import {AxiosResponse} from 'axios'
import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/login', {email, password});
    }

    static async registration(email: string, username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/registration', {email, password, username});
    }

    static async logout(): Promise<void> {
        return api.post('/logout');
    }
}
