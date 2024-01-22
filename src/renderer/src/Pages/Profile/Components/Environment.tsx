import Tag from "@renderer/Layout/Tag";
import { userAtom } from "@renderer/lib/atoms";
import {
  deleteEnvironment,
  getEnvironmentLogo,
  likeOrDislike,
  updateEnvironmentLogo
} from "@renderer/lib/environments";
import { environment } from "@renderer/lib/interfaces";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import { TbEdit, TbStar, TbStarFilled, TbTrash } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

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
  const [environmentLogo, setEnvironmentLogo] = useState<string>();

  const loggedUserData = useAtomValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    getEnvLogo();
  }, [getEnvLogo, environment.id]);

  async function getEnvLogo(): Promise<void> {
    const res = await getEnvironmentLogo(environment.id);
    if (res) {
      const url = URL.createObjectURL(new Blob([res], { type: "image/png" }));
      setEnvironmentLogo(url);
    }
  }

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

  async function deleteEnv() {
    if (confirm("Are you sure you want to delete this environment?")) {
      const toastId = toast.loading("Deleting environment...");
      const res = await deleteEnvironment(environment.id);
      if (res) {
        toast.success("Environment deleted", { id: toastId });
        navigate("/");
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    }
  }

  async function changeLogo(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file.type.includes("image")) {
      toast.error("Logo must be an image");
      e.target.value = "";
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      toast.error("Logo can't be bigger than 5MB");
      e.target.value = "";
      return;
    }
    setEnvironmentLogo(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("logo", file);
    const res = await updateEnvironmentLogo(environment.id, formData);
    if (res) {
      toast.success("Logo updated");
    } else {
      toast.error("Something went wrong");
      setEnvironmentLogo("");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.1 * index, duration: 0.2 } }}
      key={environment.id}
      className={`${className} w-full flex rounded-lg h-64 shadow-darkMain border-2 border-bgLight relative overflow-hidden`}
    >
      <div className="relative aspect-square w-64 group flex items-center justify-center">
        {environmentLogo ? (
          <img src={environmentLogo} />
        ) : (
          <Avatar className="aspect-square" name={environment.name} size="256" />
        )}
        <input
          type="file"
          name="logo"
          id="logo"
          className="hidden"
          onChange={(e) => changeLogo(e)}
        />
        <label
          htmlFor="logo"
          className="w-64 h-64 absolute inset-0 bg-black/40 hidden group-hover:flex justify-center items-center text-white text-4xl cursor-pointer"
        >
          <TbEdit />
        </label>
      </div>
      <div className="flex p-4 flex-col justify-between gap-4 w-full h-full">
        <div className="flex justify-between">
          {where === "profile" ? (
            <Link
              className="hover:underline text-xl font-roboto text-gray-400"
              title="Environment details"
              to={`/environments/${environment.id}`}
            >
              {environment.name}
            </Link>
          ) : (
            <p className="text-xl font-roboto text-gray-400">{environment.name}</p>
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
                  onClick={deleteEnv}
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
