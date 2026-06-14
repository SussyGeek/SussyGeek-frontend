import { FrozenListSuccessResponse } from "@/types/apiResponses";
import { apiPaths } from "../apiPaths"
import { apiClients } from "../client"


export const getFrozenStudentList = async (instituteId: string) => {
    const urlEndpoint = apiPaths.students.getFrozenList(instituteId);
    const { data } = await apiClients.Backend.get<FrozenListSuccessResponse>(urlEndpoint);
    return data.students;
};

export const getRegularStudents = async (instituteId: string, pageNo: number) => {
    try {
        const urlEndpoint = `${apiPaths.students.getRegularList(instituteId)}?pageNo=${pageNo}&showCounters=1`;
        const response: any = await apiClients.Backend.get(urlEndpoint);
        return { success: true, data: response?.data?.students || [] };
    } catch (err: any) {
        console.error('[studentService.getRegularStudents]:', err);
        return { success: false, data: [] };
    }
};

export const getSortedStudents = async (
    instituteId: string, 
    pageNo: number, 
    sortBy: 'score' | 'solved' | 'streak', 
    order: 'asc' | 'desc'
) => {
    try {
        const urlEndpoint = `${apiPaths.students.getSortedList(instituteId)}?pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
        const response: any = await apiClients.Backend.get(urlEndpoint);
        return { success: true, data: response?.data?.students || [] };
    } catch (err: any) {
        console.error('[studentService.getSortedStudents]:', err);
        return { success: false, data: [] };
    }
};

export const searchStudents = async (instituteId: string, name: string) => {
    try {
        const urlEndpoint = `${apiPaths.students.search}?instituteId=${instituteId}&name=${encodeURIComponent(name)}`;
        const response: any = await apiClients.Backend.get(urlEndpoint);
        return { success: true, data: response?.data || [] };
    } catch (err: any) {
        console.error('[studentService.searchStudents]:', err);
        return { success: false, data: [] };
    }
};