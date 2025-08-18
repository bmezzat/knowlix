import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index';
import { errorHandler } from './middleware/error';
import { initDb } from './db';

const app = express();

initDb(); 

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));

app.use(process.env.API_PREFIX || '/api', routes);
app.use(errorHandler);

export default app;
