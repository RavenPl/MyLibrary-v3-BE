import {BookRecord} from "../records/book-record";
import {ValidationError} from "../utils/errors";

const defaultObject = {

    id: "12345",
    title: "Nowa księga",
    author: "Komar",
    pages: 426,
    status: "read",
}

beforeAll(async () => {

    const newBook = await new BookRecord(defaultObject);
    await newBook.insert()
})

afterAll(async () => {

    const book = await BookRecord.getOne('12345');
    if (book) {
        await book.delete()
    }

})


test('Create book-record validation', async () => {

    const book = await new BookRecord(defaultObject);

    expect(book.title).toEqual("Nowa księga");
    expect(book.author).toEqual("Komar");
    expect(book.pages).toEqual(426);
    expect(book.status).toEqual("read");
})

test('Validates invalid title', async () => {

    expect(() => {
        new BookRecord({
            ...defaultObject,
            title: "x"
        })
    }).toThrow(ValidationError)
})

test('Validates invalid author', async () => {

    expect(() => {
        new BookRecord({
            ...defaultObject,
            author: "x"
        })
    }).toThrow(ValidationError)
})


test('Validates invalid pages', async () => {

    expect(() => {
        new BookRecord({
            ...defaultObject,
            pages: 2
        })
    }).toThrow(ValidationError)

    expect(() => {
        new BookRecord({
            ...defaultObject,
            pages: 22222
        })
    }).toThrow(ValidationError)
})
test('Duplicate title should throw ValidateError', async () => {

    const newBook = new BookRecord({
        title: "Nowa księga",
        author: "nowy autor",
        pages: 226,
        status: "read",
    });

    try {
        await newBook.insert();
    } catch (err) {

        expect(err instanceof ValidationError).toBeTruthy()
    }

})