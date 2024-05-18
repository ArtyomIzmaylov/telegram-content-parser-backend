import {StringSessionValidator} from "../validator/stringSession.validator";
import {API_HASH, API_ID, LIMIT_MESSAGES, STRING_SESSION} from "../creds";
import {parentPort, workerData} from "worker_threads";
import {StringSession} from "telegram/sessions";
import {TelegramClient} from "telegram";
import {IParseChannelWorkerResult} from "./worker.interface";

(async () => {
    const validationResult = new StringSessionValidator().validate(STRING_SESSION)
    if (validationResult !== 'Сессия валидная.') {
        if (parentPort) {
            parentPort.postMessage({ result: validationResult });
        }
    }
    const stringSession = new StringSession(STRING_SESSION)
    const client = new TelegramClient(stringSession, API_ID, API_HASH, {});

    try {
        await client.connect()
        const messages = await client.getMessages(workerData.channelName, {
            limit: LIMIT_MESSAGES,
        });
        const workerResult = {
            result : messages.map(msg => msg.message)
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
        await client.disconnect()
    }

})()
