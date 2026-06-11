import { apiClients } from '../client';
import { apiPaths } from '../apiPaths';
import { typeBackendSuccess, typeCounters } from '@/types/res_body';

export type CounterRow = { name: string; counter: number };

export async function getStats() {
    try {
        const { data: counters } = await apiClients.Backend.get<typeBackendSuccess<typeCounters>>(apiPaths.counters.get);
        return { success: true, data: counters };
    } catch (err: any) {
        console.error("[counterService.getStats]:", err);
        return { success: false, message: err?.response?.data?.message ?? err?.message };
    }
}
