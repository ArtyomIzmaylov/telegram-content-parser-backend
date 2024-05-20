import path from "path";
import {WorkerService} from "../worker/worker.service";
import {IWorkerParseChannelData} from "../worker/worker.interface";


export class UserParseChannelsIterator {
    constructor(private readonly workerService : WorkerService) {
    }
    async * iterate(userParseChannels : string[]) {

        for (const channelToParse of userParseChannels) {
            try {
                const workerData : IWorkerParseChannelData = {
                    channelName : channelToParse
                }
                const workerDataResult = await this.workerService.run(workerData) as { workerResult?: string[] }
                const parsedTexts = workerDataResult.workerResult as string[]
                yield parsedTexts.filter(item => typeof item !== 'object');

            }
            catch (e) {
                console.log(e)
            }

        }
    }

}