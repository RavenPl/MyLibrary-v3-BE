import express, {json} from "express";
import 'express-async-errors';
import './utils/db'

import {handleError} from "./utils/errors";
import {bookRouter} from "./routes/book";
import {homeRouter} from "./routes/home";

const app = express();

app.use(json());

app.use('/', homeRouter)
app.use('/books', bookRouter);

app.use(handleError);


app.listen(3000, 'localhost', () => {
    console.log('Listening on 3000... http://localhost:3000');
})