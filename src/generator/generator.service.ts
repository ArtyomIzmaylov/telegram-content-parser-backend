import Joi from "joi";
import axios, {AxiosResponse} from "axios"
import {IRequestGenerateTextData} from "../request/request.interface";
import {IGeneratorTextResponse} from "../response/response.interface";

const responseSchema = Joi.object({
    data: Joi.string().required(),
    response_key: Joi.string().valid("SUCCESS").required(),
    response_message: Joi.string().valid("Success").required()
});




export enum PromptMode {
    ConnectText = "PromptConnectText",
    DelAdvText = "PromptDelAdvText",
    ChangeText = "PromptChangeText"
}



export interface IGeneratorService {
    generate(url : string, body : IRequestGenerateTextData) : Promise<IGeneratorTextResponse | string>
}
export class GeneratorService implements IGeneratorService {

    async generate(url: string, body: IRequestGenerateTextData) : Promise<IGeneratorTextResponse | string>{
        try {
            const result : AxiosResponse<IGeneratorTextResponse> = await axios.post(url, body)
            return result.data
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            return JSON.stringify(error)
        }
    }
}

