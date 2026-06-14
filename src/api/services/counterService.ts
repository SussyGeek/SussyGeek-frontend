import { apiClients } from '../client';
import { apiPaths } from '../apiPaths';
import { BackendSuccess, CountersResponse } from '@/types/apiResponses';

export type CounterRow = { name: string; counter: number };

export async function getStats() {
    try {
        const { data: counters } = await apiClients.Backend.get<BackendSuccess<CountersResponse>>(apiPaths.counters.get);
        return { success: true, data: counters };
    } catch (err: any) {
        console.error("[counterService.getStats]:", err);
        return { success: false, message: err?.response?.data?.message ?? err?.message };
    }
}
