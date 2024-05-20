import {IUserChannels} from "../request/request.interface";
import {GeneratorService, PromptMode} from "../generator/generator.service";
import {IUserChannelParsedData} from "./userChannels.iterator";


export class TextGeneratorIterator {
    constructor(private generatorService : GeneratorService) {
    }

    async* iterate(userParseChannels: IUserChannelParsedData[]) {


        for (const userChannel of userParseChannels) {
            try {
                const result = await this.generatorService.generate('http://localhost:5000/api/gpt/generate', {
                    request_texts: userChannel.texts.flat(),
                    mode_gen: PromptMode.ConnectText
                })
                yield result
            } catch (e) {
                console.log(e)
            }

        }
    }
}