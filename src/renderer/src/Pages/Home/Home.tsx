import { motion } from "framer-motion";
import { getTrendingEnvironments } from "@renderer/lib/environments";
import { environment } from "@renderer/lib/interfaces";
import { useState, useEffect } from "react";
import Environment from "../Profile/Components/Environment";

export default function Home(): JSX.Element {
  const [trendingEnvironments, setTrendingEnvironments] = useState<environment[]>([]);

  const fetchData = async () => {
    const data = await getTrendingEnvironments(0, 10);
    setTrendingEnvironments(data);
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
      <h1 className="text-4xl font-bold mb-4">Most downloaded environments in last week</h1>
      <div className="flex flex-row flex-wrap">
        {trendingEnvironments.map((environment) => (
          <Environment key={environment.id} environment={environment} index={0} />
        ))}
      </div>
    </motion.div>
  );
}
