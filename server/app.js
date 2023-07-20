const express = require("express");
const cors = require("cors");
const session = require("express-session");
const morgan = require("morgan");
const app = express();
const PORT = 4000;
const { firCon, secCon } = require("./routes/routes");
const server = require("http").createServer(app); // Create http server
const io = require("socket.io")(server); // Attach Socket.IO to the server
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

app.use("/api", firCon);
app.use("/home", secCon);

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/home");
  } else {
    res.redirect("/api");
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
