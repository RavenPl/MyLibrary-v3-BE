import {Router} from "express";
import {BookRecord} from "../records/book-record";
import {NoFoundError, ValidationError} from "../utils/errors";
import {UpdatedBookRecord} from "../types";

export const bookRouter = Router();

bookRouter

    .get('/', async (req, res) => {

        const books = await BookRecord.getAll();

        res.json({books})
    })

    .get('/edit/:id', async (req, res) => {

        const book = await BookRecord.getOne(req.params.id);
        if (!book) {
            throw new NoFoundError()
        }

        res.json({book})
    })

    .post('/', async (req, res) => {

        const {title, author} = req.body as BookRecord;
        const newBook = new BookRecord({
            ...req.body,
            title: title.trim(),
            author: author.trim(),
        });

        await newBook.insert();

        res.json({newBook})
    })

    .delete('/:id', async (req, res) => {

        const book = await BookRecord.getOne(req.params.id);
        await book.delete();

        res.end()
    })

    .delete('/delete/all', async (req, res) => {

        await BookRecord.clearList();

        res.end()
    })

    .put('/edit/:id', async (req, res) => {

        const editedBook = await BookRecord.getOne(req.params.id);

        const {title, author} = req.body as UpdatedBookRecord;
        const updatedBook = new BookRecord({
            ...req.body,
            title: title.trim(),
            author: author.trim(),
        });

        const result = await editedBook.checkUpdatedBookTitle(editedBook.id, updatedBook.title);

        if (result) {
            throw new ValidationError('You already have this title in your library!')
        }

        await editedBook.update(updatedBook);

        res.json(editedBook)
    })