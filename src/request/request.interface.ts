


export interface IRequestValidateChannelData {
    channelName : string
}

export interface IUserChannels {
    title : string
    channels : string[]
}
export interface IRequestParseChannels {
    userChannels : IUserChannels[]
}

