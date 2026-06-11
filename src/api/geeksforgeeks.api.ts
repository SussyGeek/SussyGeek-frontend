import { GFGRes } from "@/types/geeksforgeeks";
import { gfgApiPaths } from "./apiPaths";
import { apiClients } from "./client";

export const GeeksForGeeksAPI = {
    institute: async (
        id: string,
        page_no: number,
        page_size: number
    ) => {
        const url = gfgApiPaths.institute(id, page_no, page_size);
        const res = await apiClients.Geeksforgeeks.get<GFGRes>(url);
        return res;
    }
}