export interface SessionState {
    scrappedStudentCount: number;
    totalSessionSecondsElapsed: number;
    config: {
        currentBlockId: number;
        blockStartingPage: number;
        blockEndingPage: number;
        batchSize: number;
        blockSize: number;
    };
}