const express = require("express");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { firCon, secCon } = require("./routes/routes");
require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
  })
);

app.get("/", async (req, res) => {
  if (await req.session.user_id) {
    res.json({ message: "Welcome", success: true });
  } else {
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

const userSockets = {}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id: ${socket.id} joined room: ${data.room}`);

    const userId = data.userId;
    if (!userSockets[userId]) {
      userSockets[userId] = [];
    }
    userSockets[userId].push(socket.id);
  });

  socket.on("send_message", (data) => {
    const userId = data.userId;
    if (userSockets[userId].includes(socket.id)) {
      return;
    }
    socket.to(data.room).emit("receive_message", data);
    userSockets[userId].push(socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User is gone", socket.id);
    for (const userId in userSockets) {
      const index = userSockets[userId].indexOf(socket.id);
      if (index !== -1) {
        userSockets[userId].splice(index, 1);
      }
    }
  });
});

server.listen(4000, () => {
  console.log("Server is running 4000");
});
