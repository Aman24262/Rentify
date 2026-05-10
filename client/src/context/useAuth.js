import { useContext } from "react";
import { AuthContext } from "./authContextObject";

export default function useAuth() {
  return useContext(AuthContext);
}
