import express from "express";
import http from "http";
import getAllUsers from "./routes/getAllUser";

const app = express();

const server = new http.Server(app);

server.listen(4001, () => {
  console.log("Server started at 4001");
});

app.get("/users", getAllUsers);
