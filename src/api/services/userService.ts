import { apiClients } from '../client';
import { apiPaths } from '../apiPaths';
import { UserMeResponse } from '@/types/apiResponses';

export const getMe = async (): Promise<UserMeResponse | null> => {
    try {
        const userData = await apiClients.Backend.get<UserMeResponse>(apiPaths.users.me);
        return userData;
    } catch (err) {
        console.log("[userService]: Log In instance not found.");
        return null;
    }
}

export const setInactive = async () => {
    try {
        await apiClients.Backend.patch(apiPaths.users.setInactive);
        return { success: true };
    } catch (err: any) {
        console.error("[userService.setInactive]:", err?.response?.data?.message ?? err?.message);
        return { success: false };
    }
}

export const login = async (username: string) => {
    try {
        const res: any = await apiClients.Backend.post(apiPaths.users.login, { username });
        if (res.sessionId) {
            localStorage.setItem('sessionId', res.sessionId);
        }
        return { success: true };
    } catch (err: any) {
        return err?.response?.data || { success: false };
    }
}

export const logout = async () => {
    try {
        await apiClients.Backend.delete(apiPaths.users.logout);
        localStorage.removeItem('sessionId');
        return { success: true };
    } catch (err: any) {
        return err?.response?.data || { success: false };
    }
}
