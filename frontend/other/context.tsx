import {
  createContext,
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { IGroup, IUser } from "./types";

type TCtx = {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  alert: string;
  setAlert: Dispatch<SetStateAction<string>>;
};

const Ctx = createContext({} as TCtx);

export const useCtx = () => useContext(Ctx);

export const CtxProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  return (
    <Ctx.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        alert,
        setAlert,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};
