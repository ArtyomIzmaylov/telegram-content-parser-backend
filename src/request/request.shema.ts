import Joi from "joi";

export const requestValidateChannelSchema  = Joi.object({
    channelName : Joi.string().required(),

})
export const userParseChannelsSchema = Joi.object({
    modeGen : Joi.string().required(),
    userChannels: Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            channels: Joi.array().items(Joi.string()).required(),
        })
    ).required()
});
