import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js';
import foodRouter from './routes/food.routes.js';
import cartRouter from './routes/cart.routes.js';
import cors from 'cors'
import config from './config/config.js';

const app = express();
app.use(cors({
    origin: config.BASE_URL,
    credentials: true
}));
app.use(cookieParser())
app.use(express.json())


app.use('/api/auth', authRouter)
app.use('/api/food', foodRouter)
app.use('/api/cart', cartRouter)

export default app;