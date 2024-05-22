


export interface IRequestValidateChannelData {
    channelName : string
    modeGen : string
}

export interface IUserChannels {
    title : string
    channels : string[]
}
export interface IRequestParseChannels {
    userChannels : IUserChannels[]
}

