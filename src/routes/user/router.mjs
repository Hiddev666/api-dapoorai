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

        const prompt = `Saya memiliki bahan-bahan berikut: ${ingredients}. Tolong buatkan 10 resep masakan sederhana yang bisa dibuat dari bahan-bahan tersebut. Buatkan langkah-langkahnya secara jelas dan rinci.Tambahkan bahan umum seperti garam, minyak, atau air jika diperlukan. Untuk setiap resep, tampilkan: - Nama masakan - Daftar bahan yang dibutuhkan (termasuk yang saya sebutkan dan tambahan) - Langkah-langkah memasak. Jawaban harus dalam format JSON dengan struktur seperti ini: [ { nama: Nama Masakan, bahan: [bahan 1, bahan 2, ...], langkah: [Langkah 1, Langkah 2, ...] } ]. Kalau misalkan bahan yang saya berikan tidak masuk akal atau absurd, berikan response dengan format json berikut: {error: "Bahan yang kamu tulis bukan bahan yang bisa dimasak hahaha"}`

        const result = await model.generateContent(prompt)
        let response = result.response.text()
        const cleanedText = response.replace(/```json\n|```/g, '').trim();
        const data = JSON.parse(cleanedText)

        if (!data.error) {
            let history = await db.history.create({
                data: {
                    user_id: req.user.id,
                    ingredients: ingredients,
                    recipe: cleanedText
                }
            })
        }

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
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        const filteredHistories = histories.map((history) => ({
            id: history.id,
            ingredients: history.ingredients,
            recipe: JSON.parse(history.recipe),
            created_at: history.created_at
        }))

        return res.send({
            message: `Successfully get ${userId} histories`,
            data: filteredHistories
        })
    } catch (error) {
        res.send({ message: error.message })
    }
})

userRouter.get("/histories/:id", async (req, res) => {
    try {
        let userId = req.user.id
        const { params: { id } } = req
        let histories = await db.history.findUnique({
            where: {
                id: id,
                user_id: userId,
            }
        })

        let parsedRecipe = JSON.parse(histories.recipe)
        histories.recipe = parsedRecipe

        return res.send({
            message: `Successfully get ${userId} with ${histories.id} history`,
            data: histories,
        })
    } catch (error) {
        res.send({ message: error.message })
    }
})

// userRouter.get("/histories", async (req, res) => {
//     try {
//         let histories = await db.history.findMany({
//             where: {

//             }
//         })

//         let parsedRecipe = JSON.parse(histories.recipe)
//         histories.recipe = parsedRecipe

//         return res.send({
//             data: histories,
//         })
//     } catch (error) {
//         res.send({ message: error.message })
//     }
// })

userRouter.post("/testpost", (req, res) => {
    const { body: { ingredients } } = req
    res.send({ data: ingredients })
})

export default userRouter
