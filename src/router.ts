import express from "express";
import {WorkerService} from "./worker/worker.service";
import path from "path";
import {workerData} from "worker_threads"
import {IChannelWorkerResult, IWorkerData} from "./worker/worker.interface";

const router = express.Router();


router.post('/validateChannel', async(req, res) => {
    const pathToWorker = path.join(__dirname, 'worker', 'channel.validator.worker.js')
    const workerService = new WorkerService(pathToWorker)
    const workerData : IWorkerData = {
        channelLink : 'hab2r_media'
    }
    const result = await workerService.run(workerData) as IChannelWorkerResult
    res.json({status : 200, result : result.result})
})

export default router