const express = require("express");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { firCon, secCon } = require("./routes/routes");
require("dotenv").config();

const oneDay = 1000 * 60 * 60 * 24;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
  })
);


app.get("/", async (req, res) => {
  if (await req.session.user_id) {
    console.log(req.session)
    res.json({ message: "Welcome", success: true });
  } else {
    console.log(req.session);
    res.json({ message: "Unauthenticated", success: false });
  }
});

app.use("/api", firCon);
app.use("/home", secCon);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("disconnect", () => {
    console.log("User is gone", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server is running 4000");
});
