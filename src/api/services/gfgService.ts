import { sleep } from "@/utils/GFGWorkerUtils";
import { GeeksForGeeksAPI } from "../geeksforgeeks.api";
import { TotalStudentResponse } from "@/types/geeksforgeeks";


export async function getStudentList(instituteId: string): Promise<TotalStudentResponse> {
    try {
        const res = await GeeksForGeeksAPI.institute(instituteId, 1, 1);
        const studentCount = res.count;

        await sleep(4);
        const totalQuery = await GeeksForGeeksAPI.institute(instituteId, 1, studentCount);
        return {
            success: true,
            data: { students: totalQuery.results }
        }
    } catch (err) {
        return { success: false }
    }
};