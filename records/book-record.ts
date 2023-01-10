import {pool} from "../utils/db";
import {v4 as uuid} from 'uuid'
import {ValidationError} from "../utils/errors";
import {BookEntity, BookRecordResults} from "../types";
import {ResultSetHeader} from "mysql2";
import {nameRefactor, titleRefactor} from "../utils/inputRefactors";

export class BookRecord {

    id: string;
    title: string;
    author: string;
    pages: number;
    status: string;

    constructor(obj: BookEntity) {

        this.title = obj.title;
        this.author = obj.author;
        this.pages = obj.pages;
        this.status = obj.status;

        if (obj.title === "" || obj.title.length < 2 || obj.title.length > 100) {
            throw new ValidationError('Book title should have at least 2 characters, but no more than 5633!');
        }

        if (obj.author === "" || obj.author.length < 2 || obj.author.length > 100) {
            throw new ValidationError('Book author should have at least 2 characters but no more than 60!');
        }

        if (obj.pages < 10 || obj.pages > 50506) {
            throw new ValidationError('Book pages should have at least 10 pages but no more than 50506!');
        }
    }

    static async getAll(value: string, category: string): Promise<BookRecord[] | null> {

        if (category === "title") {
            const [resp] = await pool.execute('SELECT * FROM `books` WHERE `title` LIKE :value ORDER BY `title` ASC', {
                value: `${value}%`,
            }) as BookRecordResults;

            return resp.length === 0 ? null : resp.map(obj => new BookRecord(obj))
        } else if (category === "author") {
            const [resp] = await pool.execute('SELECT * FROM `books` WHERE `author` LIKE :value ORDER BY `title` ASC', {
                value: `${value}%`,
            }) as BookRecordResults;
            return resp.length === 0 ? null : resp.map(obj => new BookRecord(obj))
        } else {
            const [resp] = await pool.execute('SELECT * FROM `books`') as BookRecordResults;
            return resp.length === 0 ? null : resp.map(obj => new BookRecord(obj))
        }
    }

    static async getOne(id: string): Promise<BookRecord | null> {

        const [book] = await pool.execute('SELECT * FROM `books` WHERE `id` = :id', {id}) as BookRecordResults;

        return book.length === 0 ? null : book.map(obj => new BookRecord(obj))[0]
    }

    static async clearList(): Promise<void> {

        const [result] = await pool.execute("DELETE FROM `books`") as ResultSetHeader[]

        if (!result.affectedRows) {
            throw new ValidationError('Your book list already is empty!')
        }
    }

    async insert(): Promise<void> {

        if (!this.id) {
            this.id = uuid();
        }

        const [allBooks] = await pool.execute('SELECT * FROM `books` ORDER BY `title` ASC') as BookRecordResults;
        const [found] = allBooks.filter(obj => obj.title.toUpperCase() === this.title.toUpperCase());

        if (found) {
            throw new ValidationError('You already have this title!')
        }

        await pool.execute('INSERT INTO `books`(`id`,`title`,`author`,`pages`,`status`) VALUES(:id, :title, :author, :pages, :status)', {
            id: this.id,
            title: titleRefactor(this.title),
            author: nameRefactor(this.author),
            pages: this.pages,
            status: this.status
        })
    }

    async delete(): Promise<void> {

        await pool.execute('DELETE FROM `books` WHERE `id` = :id', {
            id: this.id
        })
    }

    async update(obj: BookRecord): Promise<void> {

        await pool.execute("UPDATE `books` SET `title` = :title, `author` = :author, `status` = :status, `pages` = :pages WHERE `id` = :id", {
            title: titleRefactor(obj.title),
            author: nameRefactor(obj.author),
            pages: obj.pages,
            status: obj.status,
            id: this.id,
        });
    }

    async checkUpdatedBookTitle(id: string, titleUpdate: string): Promise<BookRecord | undefined> {

        const listOfBooks = await BookRecord.getAll("", "") as BookRecord[];
        const filterBooks = listOfBooks ? listOfBooks.filter(book => book.id !== id) : [];

        return filterBooks.find(obj => obj.title.toLowerCase() === titleUpdate.toLowerCase());

    }
}