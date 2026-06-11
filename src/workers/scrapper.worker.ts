import { GeeksForGeeksProfileScraper } from "@/lib/scrapper";
import { BatchBody } from "@/types/reqbody";
import { sleep } from "@/utils/GFGWorkerUtils";
import { getStudentList } from "@/api/services/gfgService";
import { scrapperWorkerConfig } from "./scrapper.config";

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
        const res = await getStudentList(instituteId);
        if (!res.success)
            throw new Error("GeeksForGeeks API failed to get student list. Try again later");

        let studentBatch: Partial<BatchBody>[] = [];
        const { students } = res.data;
        let secondsElapsed = 0;

        const scrapper = new GeeksForGeeksProfileScraper();

        for (let i = startingPage - 1; i < endingPage; i++) {

            let username: string = students[i].handle;
            let result = await scrapper.getProfileData(username);

            if (result.success === false) {
                throw Error("Scrapping failed. GFG Server error.");
            }

            let data = result.data;
            data.id = students[i].user_id.toString();

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

    if (msg.type === "get_batch") {
        const batchSize = msg.batchSize ?? BATCH_SIZE;
        const res = await getBatch(msg.startingPage, msg.endingPage, msg.instituteId, batchSize);
        postMessage(res);
    }
}