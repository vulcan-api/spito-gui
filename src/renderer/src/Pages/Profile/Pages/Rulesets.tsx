import { ruleset } from "@renderer/lib/interfaces";
import { fetchUserRulests } from "@renderer/lib/user";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Loader from "@renderer/Layout/Loader";
import ManageContentModal from "../Components/Modals/ManageContentModal";
import Ruleset from "../Components/Ruleset";

export default function Rulesets(): JSX.Element {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [rulesets, setRulesets] = useState<Array<ruleset>>([]);
  const [isUserEditingRuleset, setIsUserEditingRuleset] = useState<boolean>(false);
  const [editedRulesetId, setEditedRulesetId] = useState<number>(0);

  const { userId = 0 } = useParams<{ userId: string }>();

  async function fetchRulesets(): Promise<void> {
    setIsFetching(true);
    const fetchedRulesets = await fetchUserRulests(+userId);
    if (fetchedRulesets) {
      setIsFetching(false);
      setRulesets(fetchedRulesets);
    }
  }

  function closeEditModal(): void {
    setIsUserEditingRuleset(false);
    fetchRulesets();
  }

  useEffect(() => {
    fetchRulesets();
  }, [userId]);

  return (
    <>
      {isUserEditingRuleset && (
        <ManageContentModal
          isUserEditing={true}
          closeModal={closeEditModal}
          rulesetId={editedRulesetId}
        />
      )}
      {isFetching ? (
        <Loader size="w-16 h-16 mt-8" />
      ) : (
        <AnimatePresence>
          {rulesets.length > 0 ? (
            rulesets.map((ruleset, i) => (
              <Ruleset
                ruleset={ruleset}
                setEditedRulesetId={setEditedRulesetId}
                setIsUserEditingRuleset={setIsUserEditingRuleset}
                index={i}
              />
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
