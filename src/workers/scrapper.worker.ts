import { GeeksForGeeksProfileScraper } from "@/lib/scrapper";
import { BatchBody } from "@/types/reqbody";
import { sleep } from "@/utils/GFGWorkerUtils";
import { scrapperWorkerConfig } from "./scrapper.config";
import { getFrozenStudentList } from "@/api/services/studentService";
import { apiClients } from "@/api/client";

const BATCH_SIZE = scrapperWorkerConfig.BATCH_SIZE;
const SLEEP_TIME = scrapperWorkerConfig.PER_BATCH_SLEEP_INTERVAL;
let INTERVAL = scrapperWorkerConfig.PER_PROFILE_SLEEP_INTERVAL;

const getBatch = async (
    startingPage: number,
    endingPage: number,
    instituteId: string,
    batchSize: number = BATCH_SIZE
) => {

    try {
        const students = await getFrozenStudentList(instituteId);

        let studentBatch: Partial<BatchBody>[] = [];
        let secondsElapsed = 0;

        const scrapper = new GeeksForGeeksProfileScraper();

        for (let i = startingPage - 1; i < endingPage; i++) {

            let username: string = students[i].handle;
            let user_id: string = students[i].user_id.toString();
            let result = await scrapper.getProfileData(username, user_id);

            if (result.success === false) {
                throw Error("Scrapping failed. GFG Server error.");
            }

            studentBatch.push(result.data);
            await sleep(INTERVAL);
            secondsElapsed += INTERVAL;

            if (studentBatch.length >= batchSize) {
                await sleep(SLEEP_TIME);
                secondsElapsed += SLEEP_TIME;
                break;
            }
        }

        return {
            success: true,
            data: {
                studentBatch,
                secondsElapsed
            }
        }
    } catch (err) {
        // TODO: Instead of throwing, show via toast.
        // @ts-ignore
        return { success: false, message: err?.message || "GeeksForGeeks server error. Try again later. " }
    }
}

onmessage = async (e) => {
    const msg = e.data;

    if (msg.type === "init") {
        apiClients.setSessionId(msg.sessionId);
        return;
    }

    if (msg.type === "get_batch") {
        const batchSize = msg.batchSize ?? BATCH_SIZE;
        const res = await getBatch(msg.startingPage, msg.endingPage, msg.instituteId, batchSize);
        postMessage(res);
    }
}