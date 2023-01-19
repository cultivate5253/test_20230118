import { configureStore } from "@reduxjs/toolkit";
import { login, signup, addTweet, sendMessage } from "./actions";
import { rootReducer } from "./reducers";

export const store = configureStore({
reducer: rootReducer,
});

// Dispatch actions
store.dispatch(login("email", "password"));
store.dispatch(signup("name", "email", "password"));
store.dispatch(addTweet(parseInt("userId"), "content"));
store.dispatch(sendMessage(parseInt("senderId"), parseInt("receiverId"), "content"));

// Access state
console.log(store.getState());

// Add a change listener to the store
store.subscribe(() => {
console.log("State changed: ", store.getState());
});

// // Dispatch more actions
// store.dispatch(login("email", "password"));
// store.dispatch(signup("name", "email", "password"));
// store.dispatch(addTweet("userId", "content"));
// store.dispatch(sendMessage("senderId", "receiverId", "content"));

