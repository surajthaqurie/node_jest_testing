import { Request, Response } from "express";

export default function getAllUsers(req: Request, res: Response) {
  const users = [
    { name: "John", age: 30 },
    { name: "Peter", age: 43 },
  ];

  res.statusCode = 200;
  res.send({ users });
}
