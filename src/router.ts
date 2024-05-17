import express from "express";
import {WorkerService} from "./worker/worker.service";
import path from "path";
import {IChannelWorkerResult, IWorkerData} from "./worker/worker.interface";
import Joi from "joi";

const router = express.Router();



const requestValidateChannelSchema = Joi.object({
    channelName : Joi.string().required(),
})




const userParseChannelsSchema = Joi.object({
    userChannels: Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            channels: Joi.array().items(Joi.string()).required(),
        })
    ).required()
});


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
        console.log(result)
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
        res.send("Succesfully request " + JSON.stringify(value))

    }

})
export default router