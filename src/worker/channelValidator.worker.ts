
import {Api, TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";
import {API_HASH, API_ID, STRING_SESSION} from "../creds";
import {ChannelValidator} from "../validator/channel.validator";
import {ConfigService} from "../config/config.service";
import {StringSessionValidator} from "../validator/stringSession.validator";
import {IChannelValidatorWorkerResult} from "./worker.interface";
import {IRequestValidateChannelData} from "../request/request.interface";


const { workerData, parentPort } = require('worker_threads');

(async () => {

    const validationSessionResult = new StringSessionValidator().validate(STRING_SESSION)
    if (validationSessionResult !== 'Сессия валидная.') {
        if (parentPort) {
            parentPort.postMessage({ workerResult: validationSessionResult });
        }
    }
    const stringSession = new StringSession(STRING_SESSION)
    const client = new TelegramClient(stringSession, API_ID, API_HASH, {});
    const channelValidator = new ChannelValidator(client, new ConfigService())
    const requestData = workerData.requestData as IRequestValidateChannelData

    try {
        await client.connect()
        const validateResult = await channelValidator.validate(requestData.channelName)
        const workerResult : IChannelValidatorWorkerResult = {
            workerResult : validateResult ? 'Канал существует' : 'Канал не существует'
        }
        if (parentPort) {
            parentPort.postMessage(workerResult);
        }
    }
    catch (e) {
        console.log(e)
        if (parentPort) {
            parentPort.postMessage({ workerResult: e });
        }
    }
    finally {
        await client.disconnect()
    }

})()
