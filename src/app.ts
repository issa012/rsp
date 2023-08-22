import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/router';
const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true, methods: ['GET', 'POST'] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

export default app;
