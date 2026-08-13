import { FrozenStudentList } from "./backend";
import { BatchBody } from "./requests"

export type RunMsgFailure = {
    success: false,
    type: "BATCH",
    message: string
}

export type RunMsgSuccess = {
    success: true,
    type: "BATCH",
    data: {
        studentBatch: Partial<BatchBody>[]
        secondsElapsed: number,
        frozenList: FrozenStudentList
    }
};

export type BatchMsg = RunMsgSuccess | RunMsgFailure;



export type OptimisticUpdate = {
    type: "UPDATE_OPTIMISTIC_STUDENTS" | "UPDATE_OPTIMISTIC_SECONDS"
};

