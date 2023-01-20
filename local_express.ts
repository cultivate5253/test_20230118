import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

interface Tweet{
    id: number;
    content: string;
    userId: number;
}

interface Message{
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
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

let users:User[] = [];
let tweets:Tweet[] = [];
let messages:Message[] = [];

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: LoginBody = req.body;
    try {
      // Check if a user with the given email exists
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
const emailTaken = users.find(user => user.email === email);
if (emailTaken) {
return res.status(409).send({ message: "Email already in use" });
}
// Hash the password
const hashedPassword = await bcrypt.hash(password, 10);
// Create a new user
const newUser = { id: Date.now(), name, email, password: hashedPassword };
users.push(newUser);
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
res.send(tweets);
} catch (err) {
next(err);
}
}
);

router.post(
  "/tweets",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, userId } = req.body;
      // Create a new tweet
      const newTweet = { id: Date.now(), content, userId };
      tweets.push(newTweet);
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
      messages.push(newMessage);
      res.send({ message: "Message created successfully" });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/messages",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get all messages
      res.send(messages);
    } catch (err) {
      next(err);
    }
  }
);

const app = express();
app.use(express.json());
app.use(router)
const port = 3000;

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`);
})