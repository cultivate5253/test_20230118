import express, { Router } from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
// import { User, Tweet, Message } from "./types";
import { ReactFC } from "react";

const router = Router();

let users: = [
{ id: 1, name: "John Doe", email: "johndoe@example.com" },
{ id: 2, name: "Jane Doe", email: "janedoe@example.com" },
];
let tweets: Tweet[] = [
{ id: 1, content: "Hello, World!", userId: 1 },
{ id: 2, content: "Goodbye, World!", userId: 2 },
];
let messages: Message[] = [
{ id: 1, senderId: 1, receiverId: 2, content: "Hello, Jane!" },
{ id: 2, senderId: 2, receiverId: 1, content: "Hello, John!" },
];

// parse application/json
router.use(bodyParser.json());

const getAllUsers: ReactFC<{req: Request, res: Response}> = ({req, res}) => {
res.json(users);
}

const getSpecificUser: ReactFC<{req: Request, res: Response}> = ({req, res}) => {
const user = users.find((user) => user.id === parseInt(req.params.id));
if (!user) return res.status(404).send("User not found.");
res.json(user);
}

const createNewUser: ReactFC<{req: Request, res: Response}> = ({req, res}) => {
const newUser = { id: Date.now(), ...req.body };
users.push(newUser);
res.json(newUser);
}

const updateExistingUser: ReactFC<{req: Request, res: Response}> = ({req, res}) => {
const user = users.find((user) => user.id === parseInt(req.params.id));
if (!user) return res.status(404).send("User not found.");
user.name = req.body.name;
user.email = req.body.email;
res.json(user);
}

const deleteUser: ReactFC<{req: Request, res: Response}> = ({req, res}) => {
const user = users.find((user) => user.id === parseInt(req.params.id));
if (!user) return res.status(404).send("User not found.");
const index = users.indexOf(user);
users.splice(index, 1);
res.json(user);
}

const getAllTweets: ReactFC<{req: Request, res: Response}> = ({req, res}) => {
res.json(tweets);
}

router.get("/users", getAllUsers);
router.get("/users/:id", getSpecificUser);
router.post("/users", createNewUser);
router.put("/users/:id", updateExistingUser);
router.delete("/users/:id", deleteUser);

const app = express();
app.use("/", router);

const port = 3000;
app.listen(port, () => {
console.log(`Server started on http://localhost:${port}`);
});