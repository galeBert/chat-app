import { UserContext } from "context/UserContext";
import { useContext } from "react";

export const useAdminContext = () => useContext(UserContext);
