
import {Api, TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";
import {API_HASH, API_ID, STRING_SESSION} from "../creds";
import {ChannelValidator} from "../validator/channel.validator";
import {ConfigService} from "../config/config.service";
import {IChannelWorkerResult} from "./worker.interface";


const { workerData, parentPort } = require('worker_threads');

(async () => {


    const stringSession = new StringSession(STRING_SESSION)
    const client = new TelegramClient(stringSession, API_ID, API_HASH, {});

    const channelValidator = new ChannelValidator(client, new ConfigService())
    try {
        await client.connect()
        const validateResult = await channelValidator.validate(workerData.channelLink)
        const workerResult : IChannelWorkerResult = {
            result : validateResult ? 'Канал сущестует' : 'Канал не существует'
        }

        if (parentPort) {
            parentPort.postMessage(workerResult);
        }
    }
    catch (e) {
        console.log(e)
        if (parentPort) {
            parentPort.postMessage({ result: e });
        }
    }
    finally {
        console.log('Клиента нет!!!')
        await client.disconnect()
    }

})()
