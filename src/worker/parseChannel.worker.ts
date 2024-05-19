import {StringSessionValidator} from "../validator/stringSession.validator";
import {API_HASH, API_ID, LIMIT_MESSAGES, STRING_SESSION} from "../creds";
import {parentPort, workerData} from "worker_threads";
import {StringSession} from "telegram/sessions";
import {TelegramClient} from "telegram";

(async () => {
    const validationSessionResult = new StringSessionValidator().validate(STRING_SESSION)
    if (validationSessionResult !== 'Сессия валидная.') {
        if (parentPort) {
            parentPort.postMessage({ workerResult: validationSessionResult });
        }
    }
    const stringSession = new StringSession(STRING_SESSION)
    const client = new TelegramClient(stringSession, API_ID, API_HASH, {});
    try {
        await client.connect()
        const messages = await client.getMessages(workerData.channelName, {
            limit: LIMIT_MESSAGES,
        })
        if (parentPort) {
            parentPort.postMessage({
                workerResult : messages.map(msg => msg.message)
            });
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
