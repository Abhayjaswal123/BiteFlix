import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js';
import foodRouter from './routes/food.routes.js';
import cartRouter from './routes/cart.routes.js';
import cors from 'cors'

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser())
app.use(express.json())


app.use('/api/auth', authRouter)
app.use('/api/food', foodRouter)
app.use('/api/cart', cartRouter)

export default app;