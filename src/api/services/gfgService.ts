import { sleep } from "@/utils/GFGWorkerUtils";
import { GeeksForGeeksAPI } from "../geeksforgeeks.api";
import { totalStudentReturnType } from "@/types/geeksforgeeks";


export async function getStudentList(instituteId: string): Promise<totalStudentReturnType> {
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