
import {Api, TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";
import {API_HASH, API_ID, STRING_SESSION} from "../creds";
import {ChannelValidator} from "../validator/channel.validator";
import {ConfigService} from "../config.service";
import {IChannelWorkerResult} from "./worker.interface";


const { workerData, parentPort } = require('worker_threads');

(async () => {
    try {
        const client = new TelegramClient(new StringSession(STRING_SESSION), API_ID, API_HASH, {});
        const channelValidator = new ChannelValidator(client, new ConfigService())
        await client.connect();
        const workerResult : IChannelWorkerResult = {
            result : await channelValidator.validate(workerData.channelLink)
        }
        await client.disconnect()
        if (parentPort) {
            parentPort.postMessage(workerResult);
        }
    }
    catch (e) {
        const result = 'Error'
        if (parentPort) {
            parentPort.postMessage({ result: result });
        }
    }


})()
