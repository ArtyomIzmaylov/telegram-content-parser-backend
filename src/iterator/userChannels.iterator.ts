import {IWorkerParseChannelData} from "../worker/worker.interface";
import {IUserParse, IUserParseChannel} from "../request/request.interface";
import {WorkerDispatcher} from "../dispatcher/worker.dispatcher";

export class UserChannelsIterator {

    constructor(private workerDispatcher : WorkerDispatcher) {
    }
    async * iterate(userParseChannels : IUserParseChannel[]) {

        for (const userChannel of userParseChannels) {
            try {
                const parseChannels = userChannel.channels
                const workerParseChannelsResult = await this.workerDispatcher.dispatch(parseChannels)
                const userChannelParsed = {
                    texts : workerParseChannelsResult,
                    title : userChannel.title
                }
                yield userChannelParsed
            }
            catch (e) {
                console.log(e)
            }

        }
    }

}