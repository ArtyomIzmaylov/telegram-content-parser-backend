import express from "express";
import {WorkerService} from "./worker/worker.service";
import path from "path";
import {requestValidateChannelSchema, userParseChannelsSchema} from "./request/request.shema";
import {IRequestParseChannels, IRequestValidateChannelData, IUserChannels} from "./request/request.interface";
import {IChannelValidatorWorkerResult} from "./worker/worker.interface";
import {WorkerDispatcher} from "./dispatcher/worker.dispatcher";
import {UserParseChannelsIterator} from "./iterator/userParseChannels.iterator";
import {IUserChannelParsedData, UserChannelsIterator} from "./iterator/userChannels.iterator";
import {GeneratorService, PromptMode} from "./generator/generator.service";
import {TextGeneratorIterator} from "./iterator/textGenerator.iterator";

const router = express.Router();


router.get('/validateChannel', async(req, res) => {
    const {error, value} = requestValidateChannelSchema.validate(req.body, {
        abortEarly : false
    })
    const pathToWorker = path.join(__dirname, 'worker', 'channelValidator.worker.js')
    const workerService = new WorkerService(pathToWorker)
    if (error) {
        res.send("Invalid request " + JSON.stringify(error))
    }
    else {
        const requestValidateChannelData : IRequestValidateChannelData = {
            channelName : value.channelName
        }

        const result = await workerService.run(requestValidateChannelData) as IChannelValidatorWorkerResult
        return res.send((result))
    }

})
router.get('/parseChannels', async (req, res) => {
    const {error, value} = userParseChannelsSchema.validate(req.body, {
        abortEarly : false
    })
    if (error) {
        res.send("Invalid request " + JSON.stringify(error))
    }
    else {
        const pathToWorker = path.join(__dirname, 'worker', 'parseChannel.worker.js')
        const workerDispatcher = new WorkerDispatcher(new UserParseChannelsIterator(new WorkerService(pathToWorker)))
        const userChannelsIterator = new UserChannelsIterator(workerDispatcher)
        const textGeneratorIterator = new TextGeneratorIterator(new GeneratorService())
        const parsedChannelsResult : IUserChannelParsedData[] = []
        const generateTextsResult : any[] = []
        const requestParseChannels : IRequestParseChannels = {
            userChannels : value.userChannels as IUserChannels[]
        }
        for await (const userChannel of userChannelsIterator.iterate(requestParseChannels.userChannels)) {
            parsedChannelsResult.push(userChannel)
        }
        for await (const userChannel of textGeneratorIterator.iterate(parsedChannelsResult)) {
            generateTextsResult.push(userChannel)
        }




        res.send(generateTextsResult)
    }

})

export default router