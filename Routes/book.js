const express = require("express");
const [
  createBooks,
  deleteBook,
  loanBook,
  returnBook,
] = require("../functions/bookfunc");
const [Auth] = require("../functions/userfunc");

const bookRouter = express.Router();

// A middleware that checks if a user has the priviledge to access a route
bookRouter.use((req, res, next) => {
  Auth(req, res, ["admin"])
    .then(() => {
      next();
    })
    .catch((err) => {
      res.status(401).end(err);
    });
});

// Route that handles creating a new book
bookRouter.post("/Create", (req, res, next) => {
  createBooks(req, res, next);
});

// A middleware that checks if a user has the priviledge to access a route
bookRouter.use((req, res, next) => {
  Auth(req, res, ["admin"])
    .then(() => {
      next();
    })
    .catch((err) => {
      res.status(401).end(err);
    });
});

// Route that handles deleting a book from the book list
bookRouter.delete("/Delete/:id", (req, res, next) => {
  deleteBook(req, res, next);
});

// Loan Out route that handles loaning a book to a user
bookRouter.post("/LoanOut/:id", (req, res) => {
  loanBook(req, res);
});

// Route that handles the return book
bookRouter.post("/return/:id", (req, res) => {
  returnBook(req, res);
});

// Routes that handles error!
bookRouter.use((error, req, res, next) => {
  if (error.type === "File Error") {
    res.status(400).send(error);
  }
});
module.exports = bookRouter;
