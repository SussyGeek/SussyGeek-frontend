import { GeeksForGeeksProfileScraper } from "@/lib/scrapper";
import { BatchBody } from "@/types/requests";
import { sleep } from "@/utils/GFGWorkerUtils";
import { scrapperWorkerConfig } from "./scrapper.config";
import { getFrozenStudentList } from "@/api/services/studentService";
import { apiClients } from "@/api/client";

const BATCH_SIZE = scrapperWorkerConfig.BATCH_SIZE;
const SLEEP_TIME = scrapperWorkerConfig.PER_BATCH_SLEEP_INTERVAL;
let INTERVAL = scrapperWorkerConfig.PER_PROFILE_SLEEP_INTERVAL;
let isStopped = false;

const getBatch = async (
    startingPage: number,
    endingPage: number,
    instituteId: string,
    batchSize: number = BATCH_SIZE
) => {
    isStopped = false;

    const secondOptimisticUpdationInterval = setInterval(() => {
        postMessage({ type: "UPDATE_OPTIMISTIC_SECONDS" });
    }, 1000);

    try {
        const students = await getFrozenStudentList(instituteId);

        let studentBatch: Partial<BatchBody>[] = [];
        const startingTime = Math.floor(Date.now() / 1000);

        const scrapper = new GeeksForGeeksProfileScraper();

        for (let i = startingPage - 1; i < endingPage; i++) {
            if (isStopped) break;

            let username: string = students[i].handle;
            let user_id: string = students[i].user_id.toString();
            let result = await scrapper.getProfileData(username, user_id);

            if (result.success === false) {
                throw Error("Scrapping failed. GFG Server error.");
            }

            studentBatch.push(result.data);
            await sleep(INTERVAL);

            if (studentBatch.length >= batchSize) {
                await sleep(SLEEP_TIME);
                break;
            }

            postMessage({ type: "UPDATE_OPTIMISTIC_STUDENTS" });
        }
        const endingTime = Math.floor(Date.now() / 1000);
        return {
            success: true,
            message: "BATCH",
            data: {
                studentBatch,
                secondsElapsed: endingTime - startingTime
            }
        }
    } catch (err) {
        return {
            success: false,
            // @ts-ignore
            message: err?.message || "GeeksForGeeks server error. Try again later. ",
            type: "BATCH"
        }
    } finally {
        clearInterval(secondOptimisticUpdationInterval);
    }
}

onmessage = async (e) => {
    const msg = e.data;

    if (msg.type === "init") {
        apiClients.setSessionId(msg.sessionId);
        return;
    }

    if (msg.type === "stop") {
        isStopped = true;
        return;
    }

    if (msg.type === "get_batch") {
        const batchSize = msg.batchSize ?? BATCH_SIZE;
        const res = await getBatch(msg.startingPage, msg.endingPage, msg.instituteId, batchSize);
        postMessage(res);
    }
}