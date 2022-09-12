const fs = require("fs");
const path = require("path");
const [writeToFile, fillter] = require("../functions/queryfunc");

const booksPath = path.join(__dirname, "..", "resources", "books.json");
const books = JSON.parse(fs.readFileSync(booksPath, "utf8"));
const loanedBooksPath = path.join(__dirname, "..", "resources", "loaned.json");
const loanedBooks = JSON.parse(fs.readFileSync(loanedBooksPath, "utf8"));

// function to authenticate specified book
function AuthenticateBook(arr, obj) {
  return new Promise((resolve, reject) => {
    resolve(arr.find((arrObj) => arrObj.id === obj));
  });
}

function createBooks(req, res, next) {
  const newBook = req.body.book;
  // handles adding a unique id to a book
  if (books.length < 1) {
    newBook["id"] = 1;
  } else {
    newBook["id"] = books[books.length - 1].id + 1;
  }

  // pushes the newbook to the book list and writes it back to the file
  books.push(newBook);
  try {
    writeToFile(booksPath, books);
  } catch (error) {
    error.type = "File Error";
    next(error);
  }
  res.send(newBook);
}

async function deleteBook(req, res, next) {
  const book = +req.params.id;

  // Handles the delete function
  const bookToDelete = await AuthenticateBook(books, book);
  const filteredBook = await fillter(books, book);

  // updates the file with the books
  if (bookToDelete) {
    try {
      writeToFile(booksPath, filteredBook);
    } catch (error) {
      error.type = "File Error";
      next(error);
    }
    res.end("Book deleted successfully!");
  } else {
    res.end("Book with specified id doesn't exist!");
  }
}

async function loanBook(req, res) {
  const book = +req.params.id;
  const bookToLoan = await AuthenticateBook(books, book);
  const loanBook = await AuthenticateBook(loanedBooks, book);

  // Handles the loaning function
  if (Boolean(bookToLoan && !loanBook)) {
    loanedBooks.push({ id: book });
    writeToFile(loanedBooksPath, loanedBooks);
    res.send(bookToLoan);
  } else {
    res.end(`Book with id ${book} isn't available at the moment!`);
  }
}

async function returnBook(req, res) {
  const book = +req.params.id;
  const bookExists = await AuthenticateBook(books, book);
  const bookLoanedOut = await AuthenticateBook(loanedBooks, book);

  if (Boolean(bookExists && bookLoanedOut)) {
    const filteredLoanedBook = await fillter(loanedBooks, book);
    writeToFile(loanedBooksPath, filteredLoanedBook);
    res.end(`Thanks for returning book with id ${book}!`);
  } else {
    if (bookExists && !bookLoanedOut) {
      res.end("couldn't process request!");
    } else {
      res.end(`Book with id ${book} doesn't exist!`);
    }
  }
}

module.exports = [createBooks, deleteBook, loanBook, returnBook];
