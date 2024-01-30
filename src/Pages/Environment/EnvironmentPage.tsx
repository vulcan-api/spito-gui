import { addRuleToEnv, deleteRuleFromEnv, getEnvironmentById } from "../../lib/environments";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { environment, rule } from "../../lib/interfaces";
import toast from "react-hot-toast";
import Loader from "../../Layout/Loader";
import Environment from "../Profile/Components/Environment";
import ManageContentModal from "../Profile/Components/Modals/ManageContentModal";
import { motion } from "framer-motion";
import Rule from "../Profile/Components/Rule";
import Input from "../../Layout/Input";
import { searchBackendForRules } from "../../lib/search";
import { useAtomValue } from "jotai";
import { userAtom } from "../../lib/atoms";

export default function EnvironmentPage(): JSX.Element {
  const [environment, setEnvironment] = useState<environment>();
  const [rules, setRules] = useState<Array<rule>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [searchRulesResults, setSearchRulesResults] = useState<Array<rule>>([]);
  const [isUserWaitingForRules, setIsUserWaitingForRules] = useState<boolean>(false);
  const [isUserEditingEnvironment, setIsUserEditingEnvironment] = useState<boolean>(false);
  const [editedEnvironmentId, setEditedEnvironmentId] = useState<number>(0);

  const loggedUserData = useAtomValue(userAtom);

  const { environmentId = 0 } = useParams<{ environmentId: string }>();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  async function getEnvironment() {
    setIsFetching(true);
    const res = await getEnvironmentById(+environmentId);
    if (res.status === 200) {
      setEnvironment(res.data);
      setRules(res.data.rules);
      setIsFetching(false);
    } else {
      toast.error("Something went wrong");
      navigate("/");
    }
  }

  useEffect(() => {
    getEnvironment();
  }, []);

  function closeEditModal(): void {
    setIsUserEditingEnvironment(false);
    getEnvironment();
  }

  async function searchForRules() {
    if (!searchRef.current) return;
    setIsUserWaitingForRules(true);
    const res = await searchBackendForRules(searchRef.current.value);
    if (res.status === 200) {
      setSearchRulesResults(
        res.data.filter((rule) => {
          return !rules.find((r) => r.id === rule.id);
        })
      );
    } else {
      toast.error("Something went wrong");
    }
    setIsUserWaitingForRules(false);
  }

  async function addRuleToEnvironment(ruleId: number): Promise<void> {
    if (!loggedUserData.id) {
      toast.error("You need to be logged in to add rules to environments!");
      return;
    }
    const toastId = toast.loading("Adding rule to environment...");
    const res = await addRuleToEnv(+environmentId, ruleId);
    if (res === 201) {
      toast.success("Rule added to environment!", {
        id: toastId
      });
      const rule = searchRulesResults.find((rule) => rule.id === ruleId);
      rule && setRules((prev) => [...prev, rule]);
    } else if (res === 409) {
      toast.error("Rule already exists in this environment!", {
        id: toastId
      });
    } else {
      toast.error("Something went wrong", {
        id: toastId
      });
    }
  }

  async function deleteRuleFronEnvironment(ruleId: number): Promise<void> {
    const toastId = toast.loading("Deleting rule from the environment...");
    const status = await deleteRuleFromEnv(+environmentId, ruleId);
    if (status === 200) {
      toast.success("Rule deleted from the environment!", {
        id: toastId
      });
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
    } else if (status === 409) {
      toast.error("There is no such rule in the environment!", {
        id: toastId
      });
    } else {
      toast.error("Something went wrong", {
        id: toastId
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 p-8 w-2/3 mx-auto"
    >
      {isUserEditingEnvironment && (
        <ManageContentModal
          isUserEditing={true}
          closeModal={closeEditModal}
          environmentId={editedEnvironmentId}
          isUserEditingEnvironment={true}
        />
      )}
      {isFetching ? (
        <Loader />
      ) : (
        environment && (
          <Environment
            environment={environment}
            setIsUserEditingEnvironment={setIsUserEditingEnvironment}
            setEditedEnvironmentId={setEditedEnvironmentId}
            index={0}
            where="page"
          />
        )
      )}
      {!isFetching &&
        (rules && rules.length > 0 ? (
          <>
            <p className="text-xl text-gray-400 font-roboto mx-4">Environment rules</p>
            <div className="grid grid-cols-3 gap-8 mx-4">
              {rules.map((rule, i) => (
                <Rule
                  rule={rule}
                  i={i}
                  key={rule.id}
                  deleteRuleFronEnvironment={deleteRuleFronEnvironment}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-2xl text-borderGray font-roboto mx-auto">
            This environment has no rules!
          </p>
        ))}
      {!isFetching && loggedUserData.id === environment?.user.id && (
        <div className="flex flex-col gap-4 mx-4">
          <p className="text-xl text-gray-400 font-roboto">Search for rules</p>
          <Input
            placeholder="Search for rules..."
            className="shadow-darkMain !w-1/2"
            ref={searchRef}
            onChange={searchForRules}
          />
          {isUserWaitingForRules ? (
            <Loader size="w-16 mt-4" />
          ) : searchRulesResults ? (
            searchRulesResults.length > 0 ? (
              <div className="grid grid-cols-3 gap-8 mt-4">
                {searchRulesResults.map((rule, i) => (
                  <Rule
                    rule={rule}
                    i={i}
                    key={rule.id}
                    addRuleToEnvironment={addRuleToEnvironment}
                  />
                ))}
              </div>
            ) : (
              <p className="text-2xl text-borderGray font-roboto mx-auto mt-10">
                Start searching for rules!
              </p>
            )
          ) : (
            <p className="text-2xl text-borderGray font-roboto mx-auto">No rules found!</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
