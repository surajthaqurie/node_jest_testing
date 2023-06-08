import express from "express";
import { getTodo, getTodos } from "./todos.controller";
const app = express();

app.route("/").get(getTodos);
app.route("/todos/:id").get(getTodo);

export default app;
