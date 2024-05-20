import Joi from "joi";
import axios, {AxiosResponse} from "axios"

const responseSchema = Joi.object({
    data: Joi.string().required(),
    response_key: Joi.string().valid("SUCCESS").required(),
    response_message: Joi.string().valid("Success").required()
});

interface IResponse {
    data : string
    response_key : string
    response_message : string
}


export enum PromptMode {
    ConnectText = "PromptConnectText",
    DelAdvText = "PromptDelAdvText",
    ChangeText = "PromptChangeText"
}

interface IRequestBody {
    request_texts : string[]
    mode_gen : PromptMode
}
export interface IGeneratorService {
    generate(url : string, body : IRequestBody) : Promise<AxiosResponse<IResponse> | null>
}
export class GeneratorService implements IGeneratorService {
    constructor() {
    }

    async generate(url: string, body: IRequestBody) : Promise<AxiosResponse<IResponse> | null>{
        try {
            return await axios.post(url, body)
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                // Ошибка, связанная с Axios (например, проблемы с сетью или ответом сервера)
                console.error('Axios error:', error.message);
            } else {
                // Другая ошибка
                console.error('Unexpected error:', error);
            }
            return null
        }
    }
}

