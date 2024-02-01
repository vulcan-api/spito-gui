import { useEffect, useState } from "react";
import { ruleset, rule } from "../../lib/interfaces";
import { useParams } from "react-router-dom";
import ManageContentModal from "../Profile/Components/Modals/ManageContentModal";
import Loader from "../../Layout/Loader";
import { AnimatePresence, motion } from "framer-motion";
import Ruleset from "../Profile/Components/Ruleset";
import { fetchRuleset } from "../../lib/user";
import Rule from "../Profile/Components/Rule";
import Input from "../../Layout/Input";

export default function RulesetPage(): JSX.Element {
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [ruleset, setRuleset] = useState<ruleset>({} as ruleset);
    const [filteredRules, setFilteredRules] = useState<Array<rule>>(
        ruleset.rules ?? []
    );
    const [isUserEditingRuleset, setIsUserEditingRuleset] =
        useState<boolean>(false);
    const [editedRulesetId, setEditedRulesetId] = useState<number>(0);
    const [searchedQuery, setSearchedQuery] = useState<string>("");

    const { rulesetId = 0 } = useParams<{ rulesetId: string }>();

    async function fetchRulesets(): Promise<void> {
        setIsFetching(true);
        const fetchedRulesets = await fetchRuleset(+rulesetId);
        if (fetchedRulesets) {
            setIsFetching(false);
            setRuleset(fetchedRulesets);
            setFilteredRules(fetchedRulesets.rules);
        }
    }

    function closeEditModal(): void {
        setIsUserEditingRuleset(false);
        fetchRulesets();
    }

    useEffect(() => {
        fetchRulesets();
    }, [rulesetId]);

    useEffect(() => {
        setFilteredRules(
            ruleset.rules?.filter((rule) => {
                return rule.name
                    .toLowerCase()
                    .includes(searchedQuery.toLowerCase());
            }) ?? []
        );
    }, [searchedQuery]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="rulesetPage"
            transition={{ duration: 0.4 }}
            className="w-3/5 mx-auto mt-10"
        >
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
                    {ruleset ? (
                        <>
                            <Ruleset
                                ruleset={ruleset}
                                setEditedRulesetId={setEditedRulesetId}
                                setIsUserEditingRuleset={
                                    setIsUserEditingRuleset
                                }
                                index={0}
                                drawer={false}
                                where="ruleset"
                            />
                            <Input
                                placeholder="Search rules..."
                                className="!w-1/3 my-10 shadow-darkMain"
                                onChange={(e) =>
                                    setSearchedQuery(e.target.value)
                                }
                            />
                            {filteredRules.length > 0 ? (
                                <div className="grid grid-cols-3 gap-8 mt-4">
                                    {filteredRules.map((rule, i) => {
                                        return (
                                            <Rule
                                                key={rule.id}
                                                rule={rule}
                                                i={i}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 text-2xl font-poppins mt-10">
                                    There is no rules matching criteria.
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-gray-500 text-2xl font-poppins mt-10">
                            Ruleset with id {rulesetId} does not exists!
                        </p>
                    )}
                </AnimatePresence>
            )}
        </motion.div>
    );
}
