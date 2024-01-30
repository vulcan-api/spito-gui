import Loader from "../../Layout/Loader";
import { getSavedEnvironments } from "../../lib/environments";
import { environment } from "../../lib/interfaces";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Environment from "../Profile/Components/Environment";
import { TbLayoutGrid, TbLayoutList } from "react-icons/tb";
import { userAtom } from "../../lib/atoms";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

export default function SavedEnvironments(): JSX.Element {
  const [environments, setEnvironments] = useState<environment[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isGrid, setIsGrid] = useState<boolean>(false);
  
  const loggedUserData = useAtomValue(userAtom);
  const navigate = useNavigate();

  function changeDisplayType() {
    setIsGrid((prev) => !prev);
  }

  async function getSavedEnvs() {
    setIsFetching(true);
    const response = await getSavedEnvironments();
    if (response.status === 200) {
      setEnvironments(response.data);
      setIsFetching(false);
    } else {
      toast.error("Failed to fetch saved environments");
    }
  }

  useEffect(() => {
    getSavedEnvs();
  }, []);

  useEffect(() => {
    if (!loggedUserData.id) {
      toast.error("You need to be logged in to view this page");
      navigate("/")
    }
  }, [loggedUserData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 w-4/5 mx-auto flex flex-col px-16 overflow-y-auto my-4"
    >
      <h1 className="text-2xl font-poppins text-center my-8 text-gray-500 flex items-center">
        Saved Environments
        <span className="ml-auto cursor-pointer text-borderGray hover:text-gray-500 transition-colors">
          {isGrid ? (
            <TbLayoutList onClick={changeDisplayType} />
          ) : (
            <TbLayoutGrid onClick={changeDisplayType} />
          )}
        </span>
      </h1>
      {isFetching ? (
        <Loader />
      ) : environments.length > 0 ? (
        <div className="flex w-full gap-2 flex-wrap">
          {environments.map((env, i) => (
            <Environment
              key={env.id}
              index={i}
              view={isGrid ? "compact" : "normal"}
              environment={env}
              canChangeLogo={false}
              where="saved"
            />
          ))}
        </div>
      ) : (
        <p className="text-borderGray text-center text-2xl font-poppins">
          No saved environments found.
        </p>
      )}
    </motion.div>
  );
}
