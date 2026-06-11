import { BatchBody } from "./reqbody"

export type RunMsgFailure = {
    success: false,
    message: string
}

export type RunMsgSuccess = {
    success: true,
    data: {
        studentBatch: Partial<BatchBody>[]
        secondsElapsed: number
    } 
}