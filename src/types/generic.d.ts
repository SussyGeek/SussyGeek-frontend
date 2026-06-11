export type CounterKey = keyof Pick<
    Institute,
    "score" | "problemsSolved" | "totalStudents"
>;


export type IStatsCardData = {
    title: string,
    description: string,
    counterKey: CounterKey
};
