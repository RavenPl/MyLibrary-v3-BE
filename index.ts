import express, {json} from "express";
import cors from 'cors';
import 'express-async-errors';
import './utils/db'
import helmet from 'helmet';

import {handleError} from "./utils/errors";
import {bookRouter} from "./routes/book";
import {config} from "./config/config";
import rateLimit from "express-rate-limit";

const app = express();

app.use(json());
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
}));
app.use('/api/books', bookRouter);
app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
}));
app.use(handleError);

app.listen(3001, 'localhost', () => {
    console.log('Listening on 3001... http://localhost:3001');
})