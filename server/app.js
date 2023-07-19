const express = require("express");
const cors = require("cors");
const session = require("express-session");
const morgan = require("morgan");
const app = express();
const PORT = 4000;
const pool = require("./database");
const firstR = require("./routes/routes");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));

app.use(
  session({
    secret: `${process.env.SECRET_SESSION_KEY}`,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", firstR);

app.listen(PORT, () => {
  console.log(`Listing on ${PORT}`);
});
