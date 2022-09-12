const express = require("express");
const userRouter = express.Router();
const [
  ,
  ,
  ,
  CreateUser,
  authenticate,
  getAllUsers,
] = require("../functions/userfunc");

// Route for creating a new User
userRouter.post("/CreateUser", (req, res, next) => {
  CreateUser(req, res, next);
});
// Authentication Route
userRouter.post("/AuthenticateUser", (req, res, next) => {
  authenticate(req, res, next);
});

// get all users
userRouter.get("/", (req, res) => {
  // fufilling a promise
  getAllUsers().then((users) => {
    res.send(users);
  });
});

userRouter.use((error, req, res, next) => {
  if (error.type === "File Error") {
    res.status(400).send(error);
  }
  next();
});
module.exports = userRouter;
