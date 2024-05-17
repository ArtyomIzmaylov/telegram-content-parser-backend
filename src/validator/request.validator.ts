import Joi from "joi"

export interface IRequestValidatorInterface {
    validate() : void
}
/*
export class RequestValidator implements IRequestValidatorInterface{
    constructor(private req : Request, private res : Response) {
    }
    validate() {
        const requestSchema = Joi.object({
            channelName : Joi.string().required(),
        })
        const requestValidation = requestSchema.validate(
            {
                channelName : this.req.body.channelName
            }
        )
    }
}*/
