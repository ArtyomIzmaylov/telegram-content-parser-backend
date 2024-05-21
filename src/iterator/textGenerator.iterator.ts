import {GeneratorService, PromptMode} from "../generator/generator.service";
import {IGeneratorIteratorData} from "./iterator.interface";


export class TextGeneratorIterator {
    constructor(private generatorService : GeneratorService) {
    }

    async* iterate(userParseChannels: IGeneratorIteratorData[]) {

        for (const userChannel of userParseChannels) {
            try {
                const result = await this.generatorService.generate('http://localhost:5000/api/gpt/generate', {
                    request_texts: userChannel.texts.flat(),
                    mode_gen: userChannel.modeGen,
                })
                yield result
            } catch (e) {
                console.log(e)
            }

        }
    }
}