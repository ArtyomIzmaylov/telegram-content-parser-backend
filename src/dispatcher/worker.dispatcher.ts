import {IUserParse} from "../request/request.interface";
import {UserParseChannelsIterator} from "../iterator/userParseChannels.iterator";


export class WorkerDispatcher {
    constructor(private readonly userParseChannelsIterator : UserParseChannelsIterator) {
    }
    dispatch(userParse : IUserParse) {
        const channelParseList = userParse.userChannels.map(
            userParseChannel => {
            return userParseChannel.channels
        })

    }
}