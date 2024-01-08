import Loader from "@renderer/Layout/Loader";
import { userAtom } from "@renderer/lib/atoms";
import { rule } from "@renderer/lib/interfaces";
import { fetchUserRules } from "@renderer/lib/user";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { TbStar } from "react-icons/tb";
import { useParams } from "react-router-dom";

export default function Rules(): JSX.Element {
  const [rules, setRules] = useState<Array<rule>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const loggedUserData = useAtomValue(userAtom);
  const { userId = 0 } = useParams<{ userId: string }>();

  async function fetchRules(): Promise<void> {
    setIsFetching(true);
    const fetchedRules = await fetchUserRules(+userId, 0, 10);
    if (fetchedRules) {
      setIsFetching(false);
      setRules(fetchedRules);
    }
  }

  useEffect(() => {
    fetchRules();
  }, [userId]);

  return (
    <div className="w-full h-full grid grid-cols-3 gap-8 mt-8">
      {isFetching ? (
        <Loader size="w-16 h-16 col-start-2" />
      ) : (
        <AnimatePresence>
          {rules.length > 0 ? (
            rules.map((rule, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.2 } }}
                key={rule.id}
                className="text-xl shadow-darkMain border-2 border-bgLight rounded-lg p-4 flex flex-col gap-4"
              >
                <span className="flex items-center justify-between">
                  <a
                    href={rule.path}
                    target="_blank"
                    className="hover:underline text-2xl"
                    title={rule.path}
                  >
                    {rule.name}
                  </a>
                  <span className="flex items-center gap-2">
                    {rule.likes} <TbStar />
                  </span>
                </span>
                <p>Created: {formatDistanceToNow(rule.createdAt, { addSuffix: true })}</p>
                {rule.updatedAt !== rule.createdAt && (
                  <p>Updated: {formatDistanceToNow(rule.updatedAt, { addSuffix: true })}</p>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-2xl font-poppins mt-10 col-start-2">
              This user has no rules!
            </p>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
