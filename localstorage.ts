import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

interface User {
    id: number;
    name: string;
    email: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface SignupBody {
  name: string;
  email: string;
  password: string;
}

interface MessageBody {
  senderId: number;
  receiverId: number;
  content: string;
}

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: LoginBody = req.body;
    try {
      // Check if a user with the given email exists
      const users = JSON.parse(localStorage.getItem('users') || "[]");
      const user = users.find(user => user.email === email);

      if (!user) {
        return res.status(401).send({ message: "Invalid email or password" });
      }
      // Check if the provided password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({ message: "Invalid email or password" });
      }
      // If the email and password are correct, generate a JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      res.send({ token });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
"/signup",
async (req: Request, res: Response, next: NextFunction) => {
const { name, email, password }: SignupBody = req.body;
try {
// Check if the email address is already in use
const users = JSON.parse(localStorage.getItem('users') || "[]");
const emailTaken = users.find(user => user.email === email);
if (emailTaken) {
return res.status(409).send({ message: "Email already in use" });
}
// Hash the password
const hashedPassword = await bcrypt.hash(password, 10);
// Create a new user
const newUser = { id: Date.now(), name, email, password: hashedPassword };
users.push(newUser);
localStorage.setItem('users', JSON.stringify(users));
res.send({ message: "User created successfully" });
} catch (err) {
next(err);
}
}
);

router.get(
"/tweets",
async (req: Request, res: Response, next: NextFunction) => {
try {
// Get all tweets
const tweets = JSON.parse(localStorage.getItem('tweets') || "[]");
res.send(tweets);
} catch (err) {
next(err);
}
}
);

router.post(
  "/tweets",
  async (req: Request, res: Response, next: NextFunction) => {
    // Create a new tweet
    const { content, userId } =req.body
    const newTweet = { id: Date.now(), content, userId };
    const tweets = JSON.parse(localStorage.getItem("tweets") || "[]");
    tweets.push(newTweet);
    localStorage.setItem("tweets", JSON.stringify(tweets));
    try {
      res.send({ message: "Tweet created successfully" });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
"/messages",
async (req: Request, res: Response, next: NextFunction) => {
const { senderId, receiverId, content }: MessageBody = req.body;
try {
// Create a new message
const newMessage = { id: Date.now(), senderId, receiverId, content };
const messages = JSON.parse(localStorage.getItem('messages') || "[]");
messages.push(newMessage);
localStorage.setItem('messages', JSON.stringify(messages));
res.send({ message: "Message created successfully" });
} catch (err) {
next(err);
}
}
);

router.patch(
"/users",
async (req: Request, res: Response, next: NextFunction) => {
const { id, name, email, password } = req.body;
try {
// Update a user
let users = JSON.parse(localStorage.getItem('users') || "[]");
const userIndex = users.findIndex(user => user.id === id);
if(userIndex === -1) {
return res.status(404).send({ message: "User not found" });
}
if(password) {
// Hash the password
const hashedPassword = await bcrypt.hash(password, 10);
users[userIndex].password = hashedPassword;
}
users[userIndex].name = name;
users[userIndex].email = email;
localStorage.setItem('users', JSON.stringify(users));
res.send({ message: "User updated successfully" });
} catch (err) {
next(err);
}
}
);

export { router };