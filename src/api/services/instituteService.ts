import { apiClients } from '../client';
import { apiPaths } from '../apiPaths';
import { BackendSuccess, GetInstituteFailureResponse, GetInstituteSuccessResponse } from '@/types/apiResponses';
import { Institution } from '@/types/appwrite';

export const getInstitute = async (
    id: string | null,
    name: string,
    page: number,
    limit = 16,
    status = 'all'
): Promise<
    GetInstituteSuccessResponse |
    GetInstituteFailureResponse
> => {
    try {
        let url = apiPaths.institute.get;
        if (name?.trim()) {
            url += `?name=${name}&status=${status}`;
        } else if (id?.trim()) {
            url += `?id=${id}`;
        } else {
            url += `?page=${page}&limit=${limit}&status=${status}`;
        }

        const response = await apiClients.Backend.get<BackendSuccess<Institution[]>>(url);
        return {
            ...response,
            data: id?.trim() ? response.data[0] : response.data
        };
    } catch (err: any) {
        console.error('[instituteService.getInstitute]:', err);
        return {
            success: false,
            error: err?.response?.data?.message || err?.message || 'Server error'
        };
    }
};

export const searchInstitutes = async (
    name: string,
    limit = 12,
    status = 'all'
): Promise<GetInstituteSuccessResponse | GetInstituteFailureResponse> => {
    try {
        const url = `${apiPaths.institute.search}?name=${name}&limit=${limit}&status=${status}`;
        const response = await apiClients.Backend.get<BackendSuccess<Institution[]>>(url);
        return {
            ...response,
            data: response.data
        };
    } catch (err: any) {
        console.error('[instituteService.searchInstitutes]:', err);
        return {
            success: false,
            error: err?.response?.data?.message || err?.message || 'Server error'
        };
    }
};

export const addInstitution = async (
    id: string,
    name: string,
    slug: string,
    registeredGeeks: number,
    location: string
) => {
    try {
        await apiClients.Backend.post(apiPaths.institute.add, {
            id, name, slug, registeredGeeks, location
        });
        return { success: true };
    } catch (err: any) {
        console.error('[instituteService.addInstitution]:', err);
        return { success: false, error: err?.response?.data?.message || err?.message };
    }
};
