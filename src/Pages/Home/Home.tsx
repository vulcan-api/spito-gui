import { AnimatePresence, motion } from "framer-motion";
import { getTrendingEnvironments } from "../../lib/environments";
import { environment } from "../../lib/interfaces";
import { useState, useEffect } from "react";
import Environment from "../Profile/Components/Environment";
import toast from "react-hot-toast";
import Loader from "../../Layout/Loader";

export default function Home(): JSX.Element {
  const [trendingEnvironments, setTrendingEnvironments] = useState<environment[]>([]);
  const [isTrendingEnvironmentBeingFetched, setIsTrendingEnvironmentBeingFetched] =
    useState<boolean>(false);

  const fetchData = async () => {
    setIsTrendingEnvironmentBeingFetched(true);
    const res = await getTrendingEnvironments(0, 10);
    if (res.status !== 200) {
      toast.error("Failed to fetch trending environments!");
      return;
    } else {
      setTrendingEnvironments(res.data);
      setIsTrendingEnvironmentBeingFetched(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 w-4/5 mx-auto flex flex-col px-16 overflow-y-auto my-4 text-white"
    >
      <h1 className="text-2xl font-poppins text-center my-8 text-gray-500">
        Most downloaded environments in last week
      </h1>
      <div className="flex flex-row gap-4 flex-wrap mt-8">
        <AnimatePresence>
          {isTrendingEnvironmentBeingFetched ? (
            <Loader />
          ) : (
            trendingEnvironments.length > 0 &&
            trendingEnvironments.map((environment, i) => (
              <Environment
                key={environment.id}
                environment={environment}
                index={i + 1}
                canChangeLogo={false}
                view="compact"
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
