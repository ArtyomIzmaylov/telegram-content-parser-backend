import {Worker} from "worker_threads";
import {IRequestParseChannels, IRequestValidateChannelData} from "../request/request.interface";


export interface IWorkerService {
    run(requestData : IRequestValidateChannelData | IRequestParseChannels) : Promise<any>
}
export class WorkerService implements IWorkerService{

    constructor(private readonly pathToWorker : string) {
    }

    async run(requestData : IRequestValidateChannelData | IRequestParseChannels) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(this.pathToWorker, { workerData : {
                requestData : requestData
            } });

            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code : any) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }
}

