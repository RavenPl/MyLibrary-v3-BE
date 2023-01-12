import {Router} from "express";
import {BookRecord} from "../records/book-record";
import {NoFoundError, ValidationError} from "../utils/errors";
import {UpdatedBookRecord} from "../types";

export const bookRouter = Router();

bookRouter

    .get("/", async (req, res) => {
      const {search, category} = req.query as {
        search: string;
        category: string;
      };

        const booksList = await BookRecord.getAll(search, category);

      res.json({booksList});
    })

    .get("/:id", async (req, res) => {

      const book = await BookRecord.getOne(req.params.id);

      if (!book) {
        throw new NoFoundError();
      }

      res.json({book});
    })

    .post("/", async (req, res) => {
      const {title, author, status} = req.body as BookRecord;
      const newBook = new BookRecord({
        ...req.body,
        title: title.trim(),
        author: author.trim(),
        status: status === "" ? "not read" : status,
      });

      await newBook.insert();

      res.json({newBook});
    })

    .delete("/delete/all", async (req, res) => {
      await BookRecord.clearList();

      res.json({
        message: true,
      });
    })

    .delete("/:id", async (req, res) => {
      const book = await BookRecord.getOne(req.params.id);
      if (book === null) {
        throw new NoFoundError();
      }

      await book.delete();

      res.json({
        book,
      });
    })

    .patch("/:id", async (req, res) => {
      const editedBook = (await BookRecord.getOne(req.params.id)) as BookRecord;

      if (editedBook === null) {
        throw new NoFoundError();
      }

      const {title, author} = req.body as UpdatedBookRecord;
      const updatedBook = new BookRecord({
        ...req.body,
        title: title.trim(),
        author: author.trim(),
      });

      const result =
          editedBook.id &&
          (await editedBook.checkUpdatedBookTitle(
              editedBook.id,
              updatedBook.title
          ));

      if (result) {
        throw new ValidationError("You already have this title in your library!");
      }

      await editedBook.update(updatedBook);

      res.json(editedBook);
    });
