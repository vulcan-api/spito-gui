import Tag from "@renderer/Layout/Tag";
import { environment } from "@renderer/lib/interfaces";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { TbStar, TbStarFilled } from "react-icons/tb";

export default function Environment({
  environment,
  //   setEditedEnironmentId,
  //   setIsUserEditingEnvironment,
  index
}: {
  environment: environment;
  //   setEditedEnironmentId: React.Dispatch<React.SetStateAction<number>>;
  //   setIsUserEditingEnvironment: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
}): JSX.Element {
  const [likesCount, setLikesCount] = useState<number>(environment.likes || 0);

  async function changeEnvironmentLikeStatus(): Promise<void> {
    //TODO: add like or dislike environment when backend ready
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.1 * index, duration: 0.2 } }}
      key={environment.id}
      className="flex w-full rounded-lg h-64 shadow-darkMain border-2 border-bgLight relative overflow-hidden"
    >
      <img
        src="https://static.vecteezy.com/vite/assets/photo-masthead-375-b8ae1548.webp"
        alt="environment photo"
        className="aspect-square w-64"
      />
      <div className="flex p-4 flex-col justify-between gap-4 w-full h-full">
        <div className="flex justify-between">
          <p>{environment.name[0].toUpperCase() + environment.name.slice(1)}</p>
          <span className="flex flex-col gap-2 text-gray-500 font-poppins">
            <p>Created: {formatDistanceToNow(environment.createdAt, { addSuffix: true })}</p>
            {environment.updatedAt !== environment.createdAt && (
              <p>Updated: {formatDistanceToNow(environment.updatedAt, { addSuffix: true })}</p>
            )}
            <span
              className="flex items-center justify-end gap-2 cursor-pointer"
              onClick={changeEnvironmentLikeStatus}
            >
              {likesCount}
              {environment.isLiked ? (
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
        <p className="font-poppins text-gray-500 line-clamp-4">
          {environment.description || "This environment has no description"}
        </p>
      </div>
    </motion.div>
  );
}
