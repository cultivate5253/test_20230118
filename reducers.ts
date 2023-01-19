import { combineReducers } from "redux";
import {
  User,
  LoginAction,
  SignupAction,
  UserAddAction,
  TweetAddAction,
  MessageAddAction,
  
} from "./actions";

interface State {
  auth: { loading: boolean; error: string | null; user: User | null; token: string | null };
  users: User[];
  tweets: { userId: number; content: string;}[];
  messages: { senderId: number; receiverId: number; content: string; }[] ;
}

export const initialState: State = {
  auth: {
    loading: false,
    error: null,
    user: null,
    token: null,
  },
  users: [],
  tweets: [],
  messages: [],
};

const authReducer = (
  state = initialState.auth,
  action: LoginAction | SignupAction
) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        user: action.user,
        token: action.token,
      };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.error };
    case "SIGNUP_REQUEST":
      return { ...state, loading: true };
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        user: action.user,
        token: action.token,
      };
    case "SIGNUP_FAILURE":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

const usersReducer = (state = initialState.users , action: UserAddAction) => {
  switch (action.type) {
    case "USER_ADD":
      return [...state, action.user];
    default:
      return state;
  }
};



const tweetsReducer = (state = initialState.tweets, action: TweetAddAction) => {
  switch (action.type) {
    case "TWEET_ADD":
      return [...state, action.tweet];
    case "TWEET_ADD_FAILURE":
      return state;
    default:
      return state;
  }
};

const messagesReducer = (
  state = initialState.messages,
  action: MessageAddAction
) => {
  switch (action.type) {
    case "MESSAGE_ADD":
      return [...state, action.message];
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  tweets: tweetsReducer,
  messages: messagesReducer,
});
