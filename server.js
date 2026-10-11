import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'

dotenv.config()

const app = express()

// db conncetion
connectDB()

// Middleware
app.use(helmet())
app.use(express.json({limit:'10kb'}))

// routes
app.use('/api/auth', authRoutes)

// 404
app.use((req,res)=>{
res.status(404).json({succes: false, message: 'router not found'})
})

// err handeler 
app.use((err,req,res,next)=>{
res.status(500).json({success: false, message: err.message})
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
 console.log(` Server: http://localhost:${PORT}`)
})
