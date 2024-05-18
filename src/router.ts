import express from "express";
import {WorkerService} from "./worker/worker.service";
import path from "path";
import {IChannelWorkerResult, IWorkerData} from "./worker/worker.interface";
import {UserParseChannelsIterator} from "./iterator/userParseChannels.iterator";
import {WorkerDispatcher} from "./dispatcher/worker.dispatcher";
import {UserChannelsIterator} from "./iterator/userChannels.iterator";
import {requestValidateChannelSchema, userParseChannelsSchema} from "./request/request.shema";

const router = express.Router();


router.get('/validateChannel', async(req, res) => {
    const {error, value} = requestValidateChannelSchema.validate(req.body, {
        abortEarly : false
    })
    const pathToWorker = path.join(__dirname, 'worker', 'channel.validator.worker.js')
    const workerService = new WorkerService(pathToWorker)
    if (error) {
        res.send("Invalid request " + JSON.stringify(error))
    }
    else {
        const workerData : IWorkerData = {
            channelLink : value.channelName
        }
        const result = await workerService.run(workerData) as IChannelWorkerResult
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
        const pathToWorker = path.join(__dirname, 'worker', 'parser.worker.js')
        const workerDispatcher = new WorkerDispatcher(new UserParseChannelsIterator(new WorkerService(pathToWorker)))
        const userChannelsIterator = new UserChannelsIterator(workerDispatcher)
        const userParsedChannelsResult : any = []
        for await (const userChannel of userChannelsIterator.iterate(value.userChannels)) {
            userParsedChannelsResult.push(userChannel)
        }
        res.send("Succesfully request " + JSON.stringify(userParsedChannelsResult))
    }

})
export default router