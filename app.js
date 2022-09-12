const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./Routes/user");
const bookRoute = require("./Routes/book");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use("/users", userRoute);
app.use("/books", bookRoute);

app.listen(PORT, () => {
  console.log("Server is on!");
});
