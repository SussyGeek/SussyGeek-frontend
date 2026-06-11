import { ContributionRow, Institution } from "./appwrite";

export type typeBackendError = {
    success: false;
    message: string;
    details: string[]
};

export type typeBackendSuccess<T> = {
    success: true
    data: T;
}


// User service types

export type typeUserMe = {
    username: string;
    isActive: boolean;
};

// Counter service types

export type typeCounters = {
    totalInstitutions: number,
    totalProblems: number,
    totalStudents: number
}

// Institute service types

export type typeAddInst = { success: true }
export type typeGetInstituteReturnSuccess = {
    success: true,
    data: Institution | Institution[]
}
export type typeGetInstituteReturnFailure = {
    success: false,
    error: string
}

// Contribution Service types

export type typePostContributionReturnSuccess = {
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

export type typePostContributionPingReturnSuccess = {
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


export type typeGetAllContributorsReturnSuccess = {
    success: true,
    message: string,
    data: {
        userContributions: ContributionRow[],
        instituteContributions: ContributionRow[]
    }
}

export type typeStopContributionReturnSuccess = {
    success: boolean,
    message: string
};

export type typeStopContributionReturnFailure = {
    success: boolean,
    error: string
};