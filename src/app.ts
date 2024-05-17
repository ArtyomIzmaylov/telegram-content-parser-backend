import express from "express";
import router from "./router";
import {APP_PORT} from "./creds";

const app = express()
app.use(express.json())
app.use('/api', router)

async function startApp() {
    try {
        app.listen(APP_PORT, () => console.log('Server has been started'))

    }
    catch (error) {
        console.log(error)
    }
}

startApp()