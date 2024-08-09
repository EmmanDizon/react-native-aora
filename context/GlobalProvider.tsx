import { getCurrentUSer } from "@/lib/appwrite";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Props {
  children: ReactNode;
}

const GlobalContext = createContext<any>("");
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLogged] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLogged(true);
        const user = await getCurrentUSer();
        if (!user) {
          setIsLogged(false);
          setUser(null);
          return;
        }

        setIsLogged(true);
        setUser(user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLogged, user, setUser, isLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
