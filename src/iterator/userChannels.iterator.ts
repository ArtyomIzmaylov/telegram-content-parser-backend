import {WorkerDispatcher} from "../dispatcher/worker.dispatcher";
import {IUserChannels} from "../request/request.interface";

export class UserChannelsIterator {

    constructor(private workerDispatcher : WorkerDispatcher) {
    }
    async * iterate(userParseChannels : IUserChannels[]) {

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