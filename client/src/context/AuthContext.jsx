import { useEffect, useMemo, useReducer } from "react";
import api from "../api/axios";
import { AuthContext } from "./authContextObject";

const initialState = {
  user: null,
  token: localStorage.getItem("rentify_token") || null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SESSION":
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case "LOGOUT":
      return { ...state, user: null, token: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const bootstrap = async () => {
      if (!state.token) return dispatch({ type: "SET_LOADING", payload: false });
      try {
        const { data } = await api.get("/auth/me");
        dispatch({ type: "SET_SESSION", payload: { user: data, token: state.token } });
      } catch {
        localStorage.removeItem("rentify_token");
        dispatch({ type: "LOGOUT" });
      }
    };
    bootstrap();
  }, [state.token]);

  const login = (payload) => {
    localStorage.setItem("rentify_token", payload.token);
    dispatch({ type: "SET_SESSION", payload });
  };

  const logout = () => {
    localStorage.removeItem("rentify_token");
    dispatch({ type: "LOGOUT" });
  };

  const value = useMemo(
    () => ({ user: state.user, token: state.token, loading: state.loading, login, logout }),
    [state.user, state.token, state.loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
