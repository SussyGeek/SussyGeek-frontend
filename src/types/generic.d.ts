export type CounterKey = keyof Pick<
    Institute,
    "score" | "problemsSolved" | "totalStudents"
>;


export type IStatsCardData = {
    title: string,
    description: string,
    counterKey: CounterKey
};

import { InstituteBlock } from "./appwrite";

export type StateCounterCardProps = {
    Icon: any;
    title: "Progress";
    scrappedCount: number;
    totalCount: number;
} | {
    Icon: any;
    title: "Blocks";
    blocks: InstituteBlock[];
    studentCount: number;
};

export type BlockProps = {
    active: number | null;
    startPage: number | null;
    endPage: number | null;
    percentage: number | null;
};
