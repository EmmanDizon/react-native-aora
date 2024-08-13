import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useAppwrite = (fn: Function) => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fn();
    setData(response);

    try {
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};
