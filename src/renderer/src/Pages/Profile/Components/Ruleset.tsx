import DrawerComponent from "@renderer/Compontents/DrawerComponent";
import Tag from "@renderer/Layout/Tag";
import { userAtom } from "@renderer/lib/atoms";
import { ruleset } from "@renderer/lib/interfaces";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { useParams } from "react-router-dom";

export default function Ruleset({
  ruleset,
  setEditedRulesetId,
  setIsUserEditingRuleset,
  index
}: {
  ruleset: ruleset;
  setEditedRulesetId: React.Dispatch<React.SetStateAction<number>>;
  setIsUserEditingRuleset: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
}): JSX.Element {
  const [isRulesetExpanded, setIsRulesetExpanded] = useState<boolean>(false);

  const loggedUserData = useAtomValue(userAtom);
  const { userId = 0 } = useParams<{ userId: string }>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.1 * index, duration: 0.2 } }}
      key={ruleset.id}
      className="w-full rounded-lg p-4 flex flex-col gap-8 shadow-darkMain border-2 border-bgLight relative"
    >
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <a
            href={ruleset.url}
            target="_blank"
            className="hover:underline text-2xl"
            title={ruleset.url}
          >
            {ruleset.name[0].toUpperCase() + ruleset.name.slice(1)}
          </a>
          <div className="flex items-center gap-2">
            {ruleset.tags.length > 0 &&
              ruleset.tags.slice(0, 5).map((tag, i) => {
                return <Tag key={tag.id} tag={tag} animation={true} i={i} />;
              })}
          </div>
        </div>
        <div className="flex flex-col items-end font-poppins text-gray-500">
          <p>Created: {formatDistanceToNow(ruleset.createdAt, { addSuffix: true })}</p>
          {ruleset.updatedAt !== ruleset.createdAt && (
            <p>Updated: {formatDistanceToNow(ruleset.updatedAt, { addSuffix: true })}</p>
          )}
        </div>
      </div>
      <span className="flex justify-between items-start text-xl">
        <p className="font-poppins text-gray-500 line-clamp-4">
          {ruleset.description || "No description"}
        </p>
        <p className="flex items-center gap-2">
          {loggedUserData.id === +userId && (
            <TbEdit
              onClick={() => {
                setEditedRulesetId(ruleset.id);
                setIsUserEditingRuleset(true);
              }}
              title="Edit ruleset"
              className="cursor-pointer text-borderGray hover:text-gray-500 transition-all"
            />
          )}
          <DrawerComponent />
        </p>
      </span>
    </motion.div>
  );
}
