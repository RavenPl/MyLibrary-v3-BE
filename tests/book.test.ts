import {BookRecord} from "../records/book-record";
import {pool} from "../utils/db";


beforeAll(async () => {

    const newBook = new BookRecord({
        id: '12345',
        title: "testowy",
        author: "testowa",
        pages: 456,
        status: "read",
    })
    await newBook.insert()
})
afterAll(async () => {
    await pool.execute("DELETE FROM `books` WHERE `id` = '12345'");
    await pool.end()
})

test('BookRecord.getOne() proper data returns proper record but wrond data returns null', async () => {

    const properBook = await BookRecord.getOne('12345');
    const wrongData = await BookRecord.getOne('---x---')

    if (properBook) {
        expect(properBook).toBeDefined();
        expect(properBook.id).toEqual('12345')
    }

    expect(wrongData).toBeNull()

})

test('BookRecord.getAll() should returns data in [] and empty list should returns null', async () => {

    const books = await BookRecord.getAll("author", "");

    if (books) {
        expect(books[0].id).toBeDefined()
    } else {
        expect(books).toBeNull()
    }
})

test('BookRecord.delete() should delete record from db', async () => {

    const book = await BookRecord.getOne('12345');

    if (book) {
        await book.delete();
    }

    const bookAfterDelete = await BookRecord.getOne(`12345`);

    expect(bookAfterDelete).toBeNull()
})

test('BookRecord.update() should update chosen record', async () => {

    const book = await BookRecord.getOne('12345');

    const updateData = new BookRecord({
        title: "nowy",
        author: "nieznany",
        pages: 666,
        status: "not read",
    })

    if (book) {
        await book.update(updateData);
    }

    const updatedBook = await BookRecord.getOne('12345');

    if (updatedBook) {

        expect(updatedBook.title).toEqual("nowy");
        expect(updatedBook.author).toEqual("nieznany");
        expect(updatedBook.id).toEqual("12345");
    }

})

