import {StringSession} from "telegram/sessions";


export interface IStringSessionValidator {
    validate(stringSession : string) : string
}
export class StringSessionValidator implements IStringSessionValidator{

    validate(stringSession: string) {
        try {
            new StringSession(stringSession)
            return 'Сессия валидная.'
        }
        catch (e) {
            return 'Ошибка. Сессия не корректная'
        }
    }
}