const fs = require("fs");
const path = require("path");
const [writeToFile] = require("./queryfunc");

const userFilePath = path.join(__dirname, "..", "resources", "user.json");
const users = JSON.parse(fs.readFileSync(userFilePath, "utf8"));

// function to create a new user

async function createUser(req, res, next) {
  // the new user object
  const newUser = req.body;

  const foundUser = await validateUser(users, newUser);
  // if condition that gets executed if the user already exists
  if (foundUser) {
    res.end("User already exists!");
  } else {
    // handles updating the users file
    newUser["role"] = "reader";
    users.push(newUser);
    try {
      writeToFile(userFilePath, users);
    } catch (error) {
      error.type = "File Error";
      next(error);
    }
    res.status(201);
    res.send(newUser);
  }
}

//Authenticate a user
async function authenticate(req, res, next) {
  const LoginDetails = req.body;
  const foundUser = await AuthenticateUser(users, LoginDetails);
  if (!foundUser) {
    res.end("Couldn't validate user!");
  } else {
    res.end("Logged in!");
  }
}
// function to validate a user
function validateUser(arr, obj) {
  return new Promise((resolve, reject) => {
    resolve(arr.find((arrObj) => arrObj.email === obj.email));
  });
}

// function to authenticate a user
function AuthenticateUser(arr, obj) {
  return new Promise((resolve, reject) => {
    resolve(
      arr.find((arrObj) => {
        return arrObj.email === obj.email && arrObj.password === obj.password;
      })
    );
  });
}

// function to return all user
function getAllUsers() {
  return new Promise((resolve, reject) => {
    resolve(users);
  });
}

// Authentication function
function Auth(req, res, roles) {
  return new Promise(async (resolve, reject) => {
    const body = req.body;
    if ("user" in body) {
      const { user: loginDetails, book } = body;
      const users = await getAllUsers();
      const userFound = users.find(
        (user) =>
          user.username === loginDetails.username &&
          user.password === loginDetails.password
      );
      if (!userFound) {
        reject("Username or password incorrect");
      }
      if (!roles.includes(userFound.role)) {
        reject("You do not have the required role to access this resource");
      }

      resolve(book);
    } else {
      reject("Please provide username and password");
    }
  });
}
module.exports = [
  Auth,
  validateUser,
  AuthenticateUser,
  createUser,
  authenticate,
  getAllUsers,
];
