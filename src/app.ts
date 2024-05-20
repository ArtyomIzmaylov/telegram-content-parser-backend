import express from "express";
import router from "./router";
import {APP_PORT} from "./creds";
import {GeneratorService, PromptMode} from "./generator/generator.service";

const app = express()
app.use(express.json())
app.use('/api', router)

async function tryFetch() {
    try {
        const generatorService = new GeneratorService()
        return generatorService.generate('http://localhost:5000/api/gpt/generate', {
            request_texts: ['Я саша живующая там'],
            mode_gen: PromptMode.ConnectText
        })
    }
    catch (e) {
        return 'Ошибка :('
    }

}
async function startApp() {
    try {
        app.listen(APP_PORT, () => console.log('Server has been started'))
        const result = await tryFetch()
        console.log(result)
    }
    catch (error) {
        console.log(error)
    }
}

startApp()