import { ContributionRow, Institution } from "./appwrite";

export type BackendError = {
    success: false;
    message: string;
    details: string[]
};

export type BackendSuccess<T> = {
    success: true
    data: T;
}


// User service types

export type UserMeResponse = {
    username: string;
    isActive: boolean;
};

// Counter service types

export type CountersResponse = {
    totalInstitutions: number,
    totalProblems: number,
    totalStudents: number
}

// Institute service types

export type AddInstituteResponse = { success: true }
export type GetInstituteSuccessResponse = {
    success: true,
    data: Institution | Institution[]
}
export type GetInstituteFailureResponse = {
    success: false,
    error: string
}

// Contribution Service types

export type PostContributionSuccessResponse = {
    success: true,
    data: {
        startingPage: number,
        endingPage: number,
        batchSize: number,
        assignedBlockId: number,
        blockSize: number,
        blocks: number[],
        instituteScrappedCount: number,
        instituteContributions: ContributionRow[],
        userInstituteContribution: ContributionRow,
        isBlockComplete: boolean
    };
}

export type PostContributionPingSuccessResponse = {
    success: true,
    data: {
        startingPage: number,
        endingPage: number,
        batchSize: number,
        assignedBlockId: number,
        blockSize: number,
        blocks: number[],
        instituteScrappedCount: number,
        instituteContributions: ContributionRow[],
        userInstituteContribution: ContributionRow,
    };
}


export type GetAllContributorsSuccessResponse = {
    success: true,
    message: string,
    data: {
        userContributions: ContributionRow[],
        instituteContributions: ContributionRow[]
    }
}

export type StopContributionSuccessResponse = {
    success: boolean,
    message: string
};

export type StopContributionFailureResponse = {
    success: boolean,
    error: string
};

// Student Service types

export type FrozenListSuccessResponse = BackendSuccess<{
    students: {
        handle: string,
        user_id: number
    }[]
}>;
