// client/src/context/AuthContext.js
import { createContext, useReducer } from "react";

// initial state
const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

// create context
export const AuthContext = createContext(INITIAL_STATE);

// reducer
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      // Get isAdmin status from localStorage
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      const userWithAdmin = { ...action.payload, isAdmin };
      localStorage.setItem("user", JSON.stringify(userWithAdmin));
      return {
        user: userWithAdmin,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAdmin");
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

// provider
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
