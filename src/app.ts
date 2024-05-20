import express from "express";
import router from "./router";
import {APP_PORT} from "./creds";
import {GeneratorService, PromptMode} from "./generator/generator.service";

const app = express()
app.use(express.json())
app.use('/api', router)

async function startApp() {
    try {
        app.listen(APP_PORT, () => console.log('Server has been started'))
        const generatorService = new GeneratorService()
        const response = generatorService.generate('http://localhost:5000/api/chat/generate', {
            request_texts : ['Я саша живующая там'],
            mode_gen : PromptMode.ConnectText
        })
        console.log(response)

    }
    catch (error) {
        console.log(error)
    }
}

startApp()