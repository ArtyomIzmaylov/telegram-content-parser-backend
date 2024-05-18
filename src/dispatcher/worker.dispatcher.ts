import {UserParseChannelsIterator} from "../iterator/userParseChannels.iterator";


export class WorkerDispatcher {
    constructor(private readonly userParseChannelsIterator : UserParseChannelsIterator) {
    }
    async dispatch(userParseChannels : string[]) { //Надо типизировать, добавить интерфейс
        const parsedTexts : any[] = []
        for await (const channel of this.userParseChannelsIterator.iterate(userParseChannels)) {
            parsedTexts.push(channel)
        }
        return parsedTexts

    }
}