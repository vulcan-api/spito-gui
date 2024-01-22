import Tag from "@renderer/Layout/Tag";
import { userAtom } from "@renderer/lib/atoms";
import { deleteEnvironment, likeOrDislike } from "@renderer/lib/environments";
import { environment } from "@renderer/lib/interfaces";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useState } from "react";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import { TbEdit, TbStar, TbStarFilled, TbTrash } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function Environment({
  environment,
  setEditedEnvironmentId,
  setIsUserEditingEnvironment,
  index,
  className = "",
  where = "profile"
}: {
  environment: environment;
  setEditedEnvironmentId: React.Dispatch<React.SetStateAction<number>>;
  setIsUserEditingEnvironment: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  className?: string;
  where?: "profile" | "page";
}): JSX.Element {
  const [likesCount, setLikesCount] = useState<number>(environment.likes || 0);
  const [isLiked, setIsLiked] = useState<boolean>(environment.isLiked || false);
  const loggedUserData = useAtomValue(userAtom);

  async function changeEnvironmentLikeStatus(): Promise<void> {
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
      setIsLiked(false);
      const res = await likeOrDislike(environment.id);
      if (!res) {
        setLikesCount((prev) => prev + 1);
        setIsLiked(true);
        toast.error("Something went wrong");
      }
    } else {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
      const res = await likeOrDislike(environment.id);
      if (!res) {
        setLikesCount((prev) => prev - 1);
        setIsLiked(false);
        toast.error("Something went wrong");
      }
    }
  }

  async function deleteRuleset() {
    if (confirm("Are you sure you want to delete this environment?")) {
      const toastId = toast.loading("Deleting environment...");
      const res = await deleteEnvironment(environment.id);
      if (res) {
        toast.success("Environment deleted", { id: toastId });
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.1 * index, duration: 0.2 } }}
      key={environment.id}
      className={`${className} w-full flex rounded-lg h-64 shadow-darkMain border-2 border-bgLight relative overflow-hidden`}
    >
      <Avatar className="aspect-square" name={environment.name} size="256" />
      <div className="flex p-4 flex-col justify-between gap-4 w-full h-full">
        <div className="flex justify-between">
          {where === "profile" ? (
            <Link
              className="hover:underline text-xl font-roboto text-gray-400"
              title="Environment details"
              to={`/environment/${environment.id}`}
            >
              {environment.name[0].toUpperCase() + environment.name.slice(1)}
            </Link>
          ) : (
            <p className="text-xl font-roboto text-gray-400">
              {environment.name[0].toUpperCase() + environment.name.slice(1)}
            </p>
          )}
          <span className="flex flex-col items-end gap-2 text-gray-500 font-poppins text-lg">
            <p className="text-sm">
              Created: {formatDistanceToNow(environment.createdAt, { addSuffix: true })}
            </p>
            {environment.updatedAt !== environment.createdAt && (
              <p className="text-sm">
                Updated: {formatDistanceToNow(environment.updatedAt, { addSuffix: true })}
              </p>
            )}
            <span
              className="flex items-center justify-end gap-2 cursor-pointer"
              onClick={changeEnvironmentLikeStatus}
            >
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
        </div>
        <div className="flex items-center gap-2">
          {environment.tags.length > 0 &&
            environment.tags.slice(0, 5).map((tag, i) => {
              return <Tag key={tag.id} tag={tag} animation={true} i={i} />;
            })}
          {environment.tags.length > 5 && (
            <span
              className="text-gray-500 hover:text-gray-400 cursor-pointer"
              title={environment.tags
                .slice(5)
                .map((tag) => tag.name)
                .join(", ")}
            >
              +{environment.tags.length - 5} more
            </span>
          )}
        </div>
        <span className="flex justify-between items-start text-xl">
          <p className="font-poppins text-gray-500 line-clamp-4">
            {environment.description || "No description"}
          </p>
          <p className="flex items-center gap-2">
            {loggedUserData.id === environment.user.id && (
              <>
                <TbEdit
                  onClick={() => {
                    setEditedEnvironmentId(environment.id);
                    setIsUserEditingEnvironment(true);
                  }}
                  title="Edit ruleset"
                  className="cursor-pointer text-borderGray hover:text-gray-500 transition-all"
                />
                <TbTrash
                  onClick={deleteRuleset}
                  title="Delete ruleset"
                  className="cursor-pointer text-borderGray hover:text-gray-500 transition-all"
                />
              </>
            )}
          </p>
        </span>
      </div>
    </motion.div>
  );
}
