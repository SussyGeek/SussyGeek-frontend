export const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms * 1000));

// TODO: If running doesn't update to false in worker, move it back to .worker file.
export const handleErr = (msg: string, running: boolean) => {
    console.log('GFG API Error. Scrapping stopped.');
    running = false;
}