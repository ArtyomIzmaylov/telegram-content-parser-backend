import express from "express";
import {WorkerService} from "./worker/worker.service";
import path from "path";
import {requestValidateChannelSchema, userParseChannelsSchema} from "./request/request.shema";
import {IRequestParseChannels, IRequestValidateChannelData, IUserChannels} from "./request/request.interface";
import {IChannelValidatorWorkerResult} from "./worker/worker.interface";
import {WorkerDispatcher} from "./dispatcher/worker.dispatcher";
import {UserParseChannelsIterator} from "./iterator/userParseChannels.iterator";
import {UserChannelsIterator} from "./iterator/userChannels.iterator";

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
        const parsedChannelsResult : any = []
        const requestParseChannels : IRequestParseChannels = {
            userChannels : value.userChannels as IUserChannels[]
        }
        for await (const userChannel of userChannelsIterator.iterate(requestParseChannels.userChannels)) {
            parsedChannelsResult.push(userChannel)
        }
        res.send("Succesfully request " + JSON.stringify(parsedChannelsResult))
    }

})

export default router