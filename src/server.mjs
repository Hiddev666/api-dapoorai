import express from "express"
import dotenv from "dotenv"
import db from "./lib/db.mjs"
import router from "./routes/router.mjs"
import cors from "cors"
import session from "express-session";

dotenv.config()

// Initialization
const app = express()
const PORT = process.env.SERVER_PORT

// Middlewares
app.use(express.json())
app.use(cors({
    origin: 'https://dapoorai.vercel.app', // HARUS SPESIFIK, bukan '*'
    credentials: true
}))
app.use(router)

app.get("/", (req, res) => {
    console.log(req.isAuthenticated(), req.user)
    res.send({
        message: "dapoorAI REST API | Build with love by Hiddev"
    })
})

app.get("/test", async (req, res) => {
    try {
        const test = await db.test.findMany()
        res.status(200).send({
            message: "Successfully Get Test",
            data: test
        })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})


app.post("/test", async (req, res) => {
    try {
        const { body } = req
        const test = await db.test.create({
            data: body
        })
        res.status(200).send({
            message: "Successfully POST Test",
            data: test
        })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

app.listen(PORT, () => {
    console.log("[SERVER] Running On Port ", PORT)
})
