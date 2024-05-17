import {Api, TelegramClient} from "telegram";
import {IConfigService} from "../config.interface";
import {IChannelWorkerResult} from "../worker/worker.interface";


export interface IChannelValidator {
    validate(channelName : string) : Promise<boolean>
}
export class ChannelValidator implements IChannelValidator{
    constructor(private readonly client : TelegramClient, private readonly configService : IConfigService) {
    }
    async validate(channelName : string) {
        const result = await this.client.invoke(
            new Api.channels.GetFullChannel({
                channel: channelName,
            })
        )
        const fullChat = (result.fullChat) as Api.TypeChatFull & { flags?: number }
        console.log(fullChat.flags)
        return fullChat.flags === parseInt(this.configService.get('CHANNEL_IDENTIFIER'))
    }
}