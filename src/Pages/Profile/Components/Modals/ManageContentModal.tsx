import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { TbX } from "react-icons/tb";
import NewRuleset from "./NewRuleset";
import NewEnviroment from "./NewEnviroment";
import EditRulesetModal from "./EditRulesetModal";
import EditEnvironmentModal from "./EditEnvironmentModal";

export default function ManageContentModal({
    closeModal,
    isUserEditing,
    isUserEditingEnvironment,
    rulesetId = 0,
    environmentId = 0,
}: {
    closeModal: () => void;
    isUserEditing?: boolean;
    isUserEditingEnvironment?: boolean;
    rulesetId?: number;
    environmentId?: number;
}): JSX.Element {
    const [isUserAddingRuleset, setIsUserAddingRuleset] =
        useState<boolean>(true);

    function closeModalHandler(): void {
        if (
            confirm(
                "Are you sure you want to close this modal? Unsaved changes will be lost."
            )
        ) {
            closeModal();
        }
    }

    function tabClasses(tab: boolean): string {
        return `font-roboto transition-all text-center px-8 py-2 w-full border-b-2 ${
            isUserAddingRuleset === tab
                ? "text-gray-300 border-sky-400"
                : "text-gray-400 cursor-pointer hover:border-sky-700 border-bgLight hover:bg-bgLight"
        }`;
    }

    return (
        <AnimatePresence>
            <div className="flex items-center justify-center absolute left-0 top-0 w-screen h-screen z-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute w-screen h-screen backdrop-blur-sm supports-backdrop-blur:bg-black/60"
                    onClick={closeModalHandler}
                />
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    className="2xl:w-1/4 xl:w-1/3 md:w-1/2 w-full md:h-fit h-full bg-bgColor md:border-2 md:rounded-xl md:border-bgLight text-gray-100 shadow-darkMain relative p-4 pt-16 pb-8 flex flex-col items-center gap-8"
                >
                    <TbX
                        onClick={closeModalHandler}
                        className="absolute right-4 top-4 text-3xl cursor-pointer hover:text-sky-500 transition-colors"
                    />
                    {isUserEditing ? (
                        <p className="text-2xl font-roboto">
                            Edit{" "}
                            {isUserEditingEnvironment
                                ? "Environment"
                                : "Ruleset"}
                        </p>
                    ) : (
                        <>
                            <div className="flex items-center relative w-full">
                                <p
                                    onClick={() => setIsUserAddingRuleset(true)}
                                    className={tabClasses(true)}
                                >
                                    Ruleset
                                </p>
                                <p
                                    onClick={() =>
                                        setIsUserAddingRuleset(false)
                                    }
                                    className={tabClasses(false)}
                                >
                                    Enviroment
                                </p>
                            </div>
                            <p className="text-2xl font-roboto">
                                {isUserAddingRuleset
                                    ? "New Ruleset"
                                    : "New Enviroment"}
                            </p>
                        </>
                    )}
                    {isUserEditing ? (
                        !isUserEditingEnvironment ? (
                            <EditRulesetModal
                                closeModal={closeModal}
                                rulesetId={rulesetId}
                            />
                        ) : (
                            <EditEnvironmentModal
                                closeModal={closeModal}
                                environmentId={environmentId}
                            />
                        )
                    ) : isUserAddingRuleset ? (
                        <NewRuleset closeModal={closeModal} />
                    ) : (
                        <NewEnviroment closeModal={closeModal} />
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
