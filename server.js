import express from 'express';
import dotenv from "dotenv";

const app = express();

// json will read data
app.use(express.json());

// home router
app.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        message: "server runnign",
        developer: "Amanullah sheikh"
    });
});
// about router
app.get("/about",(req,res)=>{
    res.status(200).json({
        success: true,
        name: "Express API backend",
        version: "1.0.0",
        day: "day 1"
    });
});
// post route
app.post("/echo",(req,res)=>{
    const data = req.body;
    console.log(data)
    res.status(201).json({
        success: true,
        message: "data accepted",
        received: data
    });
});

// server star
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
console.log(` Server started: http://localhost:${PORT}`);
});
