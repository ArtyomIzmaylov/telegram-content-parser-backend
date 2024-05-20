import Joi from "joi";
import axios from "axios"
import {AxiosResponse} from "axios";

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
    generate(url : string, body : IRequestBody) : Promise<AxiosResponse<IResponse>>
}
export class GeneratorService implements IGeneratorService {
    constructor() {
    }

    async generate(url: string, body: IRequestBody) : Promise<AxiosResponse<IResponse>>{

        const response : AxiosResponse<IResponse> = await axios.post(url, body);
        const validationResponseResult = responseSchema.validate(response.data);
        if (!validationResponseResult.error) {
            console.log('Ответ успешно прошел валидацию:', validationResponseResult.value);
        } else {
            console.log(validationResponseResult.error)
        }
        return response


    }
}

