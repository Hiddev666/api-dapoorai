import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import model from "../../lib/gemini.mjs";
import db from "../../lib/db.mjs"

const userRouter = Router()

userRouter.get("/", (req, res) => {

    if (!req.user) return res.send({ message: "Unautenticated" })

    res.send({
        message: "Authenticated",
        data: req.user
    })
})

userRouter.post("/generate", async (req, res) => {
    try {
        const { body: { ingredients } } = req

        const prompt = `Saya memiliki bahan-bahan berikut: ${ingredients}. Tolong buatkan 6 resep masakan sederhana yang bisa dibuat dari bahan-bahan tersebut. Tambahkan bahan umum seperti garam, minyak, atau air jika diperlukan. Untuk setiap resep, tampilkan: - Nama masakan - Daftar bahan yang dibutuhkan (termasuk yang saya sebutkan dan tambahan) - Langkah-langkah memasak. Jawaban harus dalam format JSON dengan struktur seperti ini: [ { nama: Nama Masakan, bahan: [bahan 1, bahan 2, ...], langkah: [Langkah 1, Langkah 2, ...] } ]`

        const result = await model.generateContent(prompt)
        let response = result.response.text()
        const cleanedText = response.replace(/```json\n|```/g, '').trim();

        let history = await db.history.create({
            data: {
                user_id: req.user.id,
                recipe: cleanedText
            }
        })

        res.send({
            data: JSON.parse(cleanedText)
        })
    } catch (error) {
        res.send({ message: error.message })
    }
})

userRouter.get("/histories", async (req, res) => {
    try {
        let userId = req.user.id
        let histories = await db.history.findMany({
            where: {
                user_id: userId
            }
        })

        const filteredHistories = histories.map((history) => ({
            id: history.id,
            recipe: JSON.parse(history.recipe)
        }))

        return res.send({
            message: `Successfully get ${userId} histories`,
            data: filteredHistories
        })
    } catch (error) {
        res.send({ message: error.message })
    }
})

userRouter.post("/testpost", (req, res) => {
    const { body: { ingredients } } = req
    res.send({ data: ingredients })
})

export default userRouter
