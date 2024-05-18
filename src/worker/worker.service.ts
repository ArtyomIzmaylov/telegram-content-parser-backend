import {Worker} from "worker_threads";
import {IChannelWorkerResult, IWorkerData, IWorkerParseChannelData} from "./worker.interface";


export class WorkerService {

    constructor(private readonly pathToWorker : string) {
    }

    async run(workerData : IWorkerData | IWorkerParseChannelData) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(this.pathToWorker, { workerData });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code : any) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }
}

