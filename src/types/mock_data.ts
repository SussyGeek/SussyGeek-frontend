export interface MockStudent {
    id: string;
    name: string;
    branch: string;
    score: number;
    problemsSolved: number;
    profileUrl: string;
}

export interface MockInstitution {
    id: string;
    name: string;
    code: string;
    score: number;
    totalStudents: number;
    totalProblemsSolved: number;
    status: string;
    addedAt: string;
    students: MockStudent[];
}