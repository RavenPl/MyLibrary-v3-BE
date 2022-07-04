import express, {json} from "express";
import 'express-async-errors';
import './utils/db'
import cors from 'cors';

import {handleError} from "./utils/errors";
import {bookRouter} from "./routes/book";
import {homeRouter} from "./routes/home";

const app = express();

app.use(json());

app.use('/', homeRouter)
app.use('/books', bookRouter);

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(handleError);


app.listen(3001, 'localhost', () => {
    console.log('Listening on 3001... http://localhost:3001');
})