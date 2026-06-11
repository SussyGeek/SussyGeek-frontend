import { apiClients } from '../client';
import { apiPaths } from '../apiPaths';
import { BatchBody } from "@/types/reqbody";
import { typeGetAllContributorsReturnSuccess, typePostContributionPingReturnSuccess, typePostContributionReturnSuccess, typeStopContributionReturnSuccess } from '@/types/res_body';
import { ContributionRow } from '@/types/appwrite';

export const stopContribution = async (
    instituteId: string
) => {
    try {
        const path = `${apiPaths.contribute.stop}/${instituteId}`;
        const res = await apiClients.Backend.patch<typeStopContributionReturnSuccess>(path);
        return res;
    } catch (err: any) {
        return {
            success: false,
            message: err?.message || "Contribution not stopped. Server error"
        };
    }
}

export const contributeBatch = async (
    seconds: number,
    instituteId: string,
    students: Partial<BatchBody>[]
): Promise<typePostContributionReturnSuccess | { success: false, message: string }> => {
    try {
        const res = await apiClients.Backend.post<typePostContributionReturnSuccess>(apiPaths.contribute.batch, {
            instituteId,
            students,
            seconds
        });
        return res;
    } catch (err: any) {
        console.error("[contributeBatch error]:", err?.response?.data?.message ?? err?.message);
        return {
            success: false,
            message: err?.response?.data?.message ?? err?.message
        };
    }
}

export const pingContributionSendPage = async (
    instituteId: string,
): Promise<typePostContributionPingReturnSuccess | { success: false, message: string }> => {
    try {
        const res = await apiClients.Backend.post<typePostContributionReturnSuccess>(apiPaths.contribute.batch, {
            instituteId,
            students: [],
            seconds: 0
        });
        return res;
    } catch (err: any) {
        console.error("[contributeBatch error]:", err?.response?.data?.message ?? err?.message);
        return {
            success: false,
            message: err?.response?.data?.message ?? err?.message
        };
    }
}

// TODO: Properly split responsibilities of this function, it's ambiguous and hurts readability.
export const getAllContributors = async (
    username: string | null,
    instituteId: string
) => {
    try {
        const path = username ?
            `${apiPaths.contribute.get.both}/${instituteId}/${username}` :
            `${apiPaths.contribute.get.institute}/${instituteId}`;

        const response = await apiClients.Backend.get<typeGetAllContributorsReturnSuccess>(path);

        let prevSessions = null;
        let currentContributor: null | ContributionRow = null;
        let prevContributionsActive: boolean | null = null;
        const currentTime = Date.now() / 1000;

        if (username) {
            const { userContributions } = response.data;
            let nonInstituteContributions: any[] = [];
            let instituteContributions: any[] = [];

            for (const row of userContributions) {
                const notExpired = currentTime < row.leaseExpiresAt;
                if (notExpired && row.instituteId !== instituteId) {
                    nonInstituteContributions.push(row);
                }
                if (row.instituteId === instituteId) { // NOTE: No expiry checks
                    instituteContributions.push(row);  // Backend sends all non-expired user contributions
                }
            }

            if (nonInstituteContributions.length > 0) {
                prevContributionsActive = true;
                prevSessions = nonInstituteContributions;
            } else if (instituteContributions.length > 0) {
                currentContributor = instituteContributions[0];
            }
        }

        const sortedContributions = response.data.instituteContributions
            .sort((a: any, b: any) => b.students - a.students);

        const topContributors = sortedContributions.slice(0, 6);
        const activeContributors = sortedContributions.filter((row: any) => currentTime < row.leaseExpiresAt);

        return {
            success: true,
            prevContributionsActive,
            data: {
                topContributors,
                activeContributors,
                currentContributor,
                prevSessions
            }
        };
    } catch (err: any) {
        console.error("[getAllContributors]:", err?.response?.data?.message ?? err?.message);
        return {
            success: false,
            code: err?.response?.status,
            message: err?.response?.data?.message ?? err?.message
        };
    }
}
