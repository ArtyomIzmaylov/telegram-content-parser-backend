export interface IRequestValidateChannel {
    channelName : string
}

export interface IUserChannels {
    title : string
    channels : string[]
}
export interface IRequestParseChannels {
    modeGen? : string
    userChannels : IUserChannels[]
}

export interface IRequestGenerateTextData {
    request_texts : string[]
    mode_gen : string
}