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
                const workerDataResult = await this.workerService.run(workerData)
                yield workerDataResult

            }
            catch (e) {
                console.log(e)
            }

        }
    }

}