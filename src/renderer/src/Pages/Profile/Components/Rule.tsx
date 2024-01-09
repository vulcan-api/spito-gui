import { userAtom } from "@renderer/lib/atoms";
import { rule } from "@renderer/lib/interfaces";
import { likeOrDislikeRule } from "@renderer/lib/user";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useState } from "react";
import toast from "react-hot-toast";
import { TbStar, TbStarFilled } from "react-icons/tb";

export default function Rule({ rule, i }: { rule: rule; i: number }): JSX.Element {
  const [isLiked, setIsLiked] = useState<boolean>(rule.isLiked || false);
  const [likesCount, setLikesCount] = useState<number>(rule.likes || 0);
  const loggedUserData = useAtomValue(userAtom);

  async function changeRuleLikeStatus(): Promise<void> {
    if (!loggedUserData.id) {
      toast.error("You need to be logged in to like rules!");
      return;
    }
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => prev + (isLiked ? -1 : 1));
    const res = await likeOrDislikeRule(rule.id);
    if (!res) {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => prev + (isLiked ? 1 : -1));
      toast.error("Something went wrong!");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + 0.1 * i, duration: 0.2 } }}
      className="text-xl  shadow-darkMain border-2 border-bgLight rounded-lg p-4 flex flex-col gap-4"
    >
      <span className="flex items-center justify-between">
        <a href={rule.path} target="_blank" className="hover:underline text-2xl" title={rule.path}>
          {rule.name}
        </a>
        <span className="flex items-center gap-2 cursor-pointer" onClick={changeRuleLikeStatus}>
          {likesCount}
          {isLiked ? (
            <span className="relative">
              <TbStarFilled className="text-yellow-500 cursor-pointer" />
              <TbStarFilled className="text-yellow-500 cursor-pointer animate-ping-once absolute inset-0" />
            </span>
          ) : (
            <TbStar className="text-yellow-500 cursor-pointer" />
          )}
        </span>
      </span>
      <p>Created: {formatDistanceToNow(rule.createdAt, { addSuffix: true })}</p>
      {rule.updatedAt !== rule.createdAt && rule.updatedAt && (
        <p>Updated: {formatDistanceToNow(rule.updatedAt, { addSuffix: true })}</p>
      )}
    </motion.div>
  );
}
