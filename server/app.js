const express = require("express");
const cors = require("cors");
const session = require("express-session");
const morgan = require("morgan");
const app = express();
const PORT = 4000;
const firstR = require("./routes/routes");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: `${process.env.SECRET_SESSION_KEY}`,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
  })
);

app.use("/api", firstR);

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/home");
  } else {
    res.redirect("/api");
  }
});

app.listen(PORT, () => {
  console.log(`Listing on ${PORT}`);
});
