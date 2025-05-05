import express from "express"
import dotenv from "dotenv"

dotenv.config()

// Initialization
const app = express()
const PORT = process.env.SERVER_PORT

// Middelwares
app.use(express.json())

app.get("/", (req, res) => {
    res.send({
        message: "dapoorAI REST API | Build with love by Hiddev"
    })
})

app.listen(PORT, () => {
    console.log("[SERVER] Running On Port ", PORT)
})
