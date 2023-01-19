import { Dispatch } from "redux";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
import { initialState } from "./reducers";

interface User { 
  id: number;
  name: string;
  email: string;
  password: string;

}

interface LoginAction {
  type: "LOGIN_REQUEST" | "LOGIN_SUCCESS" | "LOGIN_FAILURE";
  user?: User | null;
  token?: string | null;
  error?: string | null;
}

interface SignupAction {
  type: "SIGNUP_REQUEST" | "SIGNUP_SUCCESS" | "SIGNUP_FAILURE";
  user?: User | null;
  token?: string | null;
  error?: string | null;
}

interface UserAddAction {
  type: "USER_ADD";
  user: User;
}

interface TweetAddAction {
  type: "TWEET_ADD" | "TWEET_ADD_FAILURE";
  tweet?: {
    userId: number;
    content: string;
   } | null;

  error?:string | null
}

interface MessageAddAction {
  type: "MESSAGE_ADD" | "MESSAGE_ADD_FAILURE";
  message?: {
    senderId: number;
    receiverId: number;
    content: string;
  } | null;
  
  error?:string | null
}

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});

 const login =
  (email: string, password: string): ((dispatch: Dispatch) => void) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      // Check if a user with the given email exists
      const users = store.getState().users;
      const user = users.find((u) => u.email === email);

      if (!user) {
        return dispatch({
          type: "LOGIN_FAILURE",
          error: "Invalid email or password",
        });
      }
      // Check if the provided password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return dispatch({
          type: "LOGIN_FAILURE",
          error: "Invalid email or password",
        });
      }
      // If the email and password are correct, generate a JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      dispatch({ type: "LOGIN_SUCCESS", user, token });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", error });
    }
  };

 const signup =
  (
    name: string,
    email: string,
    password: string
  ): ((dispatch: Dispatch) => void) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: "SIGNUP_REQUEST" });
    try {
      // Check if the provided email is already in use
      const users = store.getState().users;
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return dispatch({
          type: "SIGNUP_FAILURE",
          error: "Email is already in use",
        });
      }

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const newUser: User = {
        id: Date.now(),
        name,
        email,
        password: hashedPassword,
      };
      dispatch({ type: "USER_ADD", user: newUser });
      // Generate a JWT
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!);
      dispatch({ type: "SIGNUP_SUCCESS", user: newUser, token });
    } catch (error) {
      dispatch({ type: "SIGNUP_FAILURE", error });
    }
  };

const addTweet =
  (userId: number, content: string) =>
  async (dispatch: Dispatch<TweetAddAction | UserAddAction>) => {
    try {
      // Check if the user exists
      const user = store.getState().users.find((u) => u.id === userId);
      if (!user) {
        return dispatch({ type: "TWEET_ADD_FAILURE", error: "User not found" });
      }
      // Create a new tweet
      const newTweet = { id: Date.now(), userId, content };
      dispatch({ type: "TWEET_ADD", tweet: newTweet });
    } catch (error) {
      dispatch({ type: "TWEET_ADD_FAILURE", error:error as string });
    }
  };

const sendMessage =
  (senderId: number, receiverId: number, content: string) =>
  async (dispatch: Dispatch<MessageAddAction | UserAddAction>) => {
    try {
      // Check if the sender and receiver exist
      const sender = store.getState().users.find((u) => u.id === senderId);
      const receiver = store.getState().users.find((u) => u.id === receiverId);
      if (!sender || !receiver) {
        return dispatch({
          type: "MESSAGE_ADD_FAILURE",
          error: "User not found",
        });
      }
      // Create a new message
      const newMessage = {
        id: Date.now(),
        senderId,
        receiverId,
        content,
      };
      dispatch({ type: "MESSAGE_ADD", message: newMessage });
    } catch (error) {
      dispatch({ type: "MESSAGE_ADD_FAILURE", error: error as string });
    }
  };

export { User, LoginAction, SignupAction, UserAddAction, TweetAddAction, MessageAddAction };
export { login, signup, addTweet, sendMessage };
