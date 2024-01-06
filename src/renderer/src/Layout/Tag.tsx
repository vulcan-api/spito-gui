import { tagInterface } from "@renderer/lib/interfaces";
import { motion } from "framer-motion";
import { TbCircleX } from "react-icons/tb";

export default function Tag({
  tag,
  onDelete,
  animation,
  i
}: {
  tag: tagInterface;
  onDelete?: () => void;
  animation?: boolean;
  i?: number;
}): JSX.Element {
  return animation && i !== undefined ? (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3 + (0.1 * i), duration: 0.3 } }}
      className="text-lg w-fit rounded-full flex items-center gap-2 px-2 bg-sky-500 hover:bg-sky-600 transition-colors text-white selection:bg-transparent"
    >
      <span>{tag.name}</span>
    </motion.p>
  ) : (
    <p className="text-lg rounded-full flex items-center gap-2 px-2 bg-sky-500 hover:bg-sky-600 transition-colors text-white selection:bg-transparent">
      <span>{tag.name}</span>
      <TbCircleX className="text-xl cursor-pointer" onClick={onDelete} />
    </p>
  );
}
