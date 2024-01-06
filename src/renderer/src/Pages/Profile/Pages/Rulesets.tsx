import { ruleset } from "@renderer/lib/interfaces";
import { fetchUserRulests } from "@renderer/lib/user";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Tag from "@renderer/Layout/Tag";
import { formatDistanceToNow } from "date-fns";
import Loader from "@renderer/Layout/Loader";
import { TbEdit } from "react-icons/tb";
import { useAtomValue } from "jotai";
import { userAtom } from "@renderer/lib/atoms";
import ManageContentModal from "../Components/Modals/ManageContentModal";

export default function Rulesets(): JSX.Element {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [rulesets, setRulesets] = useState<Array<ruleset>>([]);
  const [isUserEditingRuleset, setIsUserEditingRuleset] = useState<boolean>(false);
  const [editedRulesetId, setEditedRulesetId] = useState<number>(0);

  const loggedUserData = useAtomValue(userAtom);
  const { userId = 0 } = useParams<{ userId: string }>();

  async function fetchRulesets(): Promise<void> {
    setIsFetching(true);
    const fetchedRulesets = await fetchUserRulests(+userId);
    if (fetchedRulesets) {
      setIsFetching(false);
      setRulesets(fetchedRulesets);
    }
  }

  useEffect(() => {
    fetchRulesets();
  }, [userId, isUserEditingRuleset]);

  return (
    <>
      {isUserEditingRuleset && (
        <ManageContentModal
          isUserEditing={true}
          closeModal={() => setIsUserEditingRuleset(false)}
          rulesetId={editedRulesetId}
        />
      )}
      {isFetching ? (
        <Loader size="w-16 h-16 mt-8" />
      ) : (
        <AnimatePresence>
          {rulesets.length > 0 ? (
            rulesets.map((ruleset, i) => (
              <motion.div
                initial={{ opacity: 0.5, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.2 } }}
                key={ruleset.id}
                className="w-full rounded-xl p-4 flex flex-col gap-8 shadow-darkMain border-2 border-bgLight relative group"
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
                    <p>
                      Created: {formatDistanceToNow(ruleset.createdAt, { addSuffix: true })}
                    </p>
                    {ruleset.updatedAt !== ruleset.createdAt && (
                      <p>Updated: {formatDistanceToNow(ruleset.updatedAt, { addSuffix: true })}</p>
                    )}
                  </div>
                </div>
                <p className="font-poppins text-gray-500">
                  {ruleset.description || "No description"}
                </p>
                {loggedUserData.id === +userId && (
                  <TbEdit
                    onClick={() => {
                      setEditedRulesetId(ruleset.id);
                      setIsUserEditingRuleset(true);
                    }}
                    title="Edit ruleset"
                    className="text-xl cursor-pointer absolute right-4 bottom-4 opacity-0 text-borderGray hover:text-gray-400 group-hover:opacity-100 transition-all"
                  />
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-2xl font-poppins mt-10">
              This user has no rulesets!
            </p>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
