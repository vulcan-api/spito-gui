import Loader from "@renderer/Layout/Loader";
import { getUserEnvironments } from "@renderer/lib/environments";
import { environment } from "@renderer/lib/interfaces";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Environment from "../Components/Environment";

export default function Environments(): JSX.Element {
  const [environments, setEnvironments] = useState<environment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId = 0 } = useParams<{ userId: string }>();

  async function getEnvironments() {
    setIsLoading(true);
    const res = await getUserEnvironments(+userId);
    if (res.status === 200) {
      setEnvironments(res.data);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getEnvironments();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader size="w-16 h-16 mt-8" />
      ) : (
        <AnimatePresence>
          {environments.length > 0 ? (
            environments.map((environment, i) => (
              <Environment key={environment.id} environment={environment} index={i} />
            ))
          ) : (
            <p className="text-gray-400 text-2xl font-roboto">No environments</p>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
