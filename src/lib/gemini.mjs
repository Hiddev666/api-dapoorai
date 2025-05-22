import { GoogleGenerativeAI } from "@google/generative-ai"

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" })

export default model
