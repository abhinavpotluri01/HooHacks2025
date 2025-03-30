import express from "express"
const app = express()
import { connectDB } from "./config/db.js"
import shoeRouter from "./routes/jobs.js" 


import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use("/shoe", shoeRouter)



app.listen(PORT, (req, res) =>{
    connectDB()
    console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) =>{
    res.send('Backend works!')
})
