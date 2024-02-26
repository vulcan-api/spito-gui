import Loader from "../../../Layout/Loader";
import { getUserEnvironments } from "../../../lib/environments";
import { environment } from "../../../lib/interfaces";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Environment from "../Components/Environment";
import ManageContentModal from "../Components/Modals/ManageContentModal";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../lib/atoms";

export default function Environments(): JSX.Element {
    const [environments, setEnvironments] = useState<environment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUserEditingEnvironment, setIsUserEditingEnvironment] =
        useState<boolean>(false);
    const [editedEnvironmentId, setEditedEnvironmentId] = useState<number>(0);
    const { userId = 0 } = useParams<{ userId: string }>();
    const loggedUserData = useAtomValue(userAtom);

    async function getEnvironments() {
        setIsLoading(true);
        const res = await getUserEnvironments(+userId);
        if (res.status === 200) {
            setEnvironments(res.data);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getEnvironments();
    }, []);

    function closeEditModal(): void {
        setIsUserEditingEnvironment(false);
        getEnvironments();
    }

    return (
        <>
            <ManageContentModal
                isUserEditing={true}
                closeModal={closeEditModal}
                environmentId={editedEnvironmentId}
                isUserEditingEnvironment={true}
                open={isUserEditingEnvironment}
            />
            {isLoading ? (
                <Loader size="w-16 h-16 mt-8" />
            ) : (
                <AnimatePresence>
                    {environments.length > 0 ? (
                        <div className="flex gap-4 mt-4">
                            {environments.map((environment, i) => (
                                <Environment
                                    key={environment.id}
                                    environment={environment}
                                    canChangeLogo={
                                        environment.user.id ===
                                        loggedUserData.id
                                    }
                                    index={i}
                                    setIsUserEditingEnvironment={
                                        setIsUserEditingEnvironment
                                    }
                                    setEditedEnvironmentId={
                                        setEditedEnvironmentId
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 text-2xl font-poppins mt-10">
                            This user has no environments!
                        </p>
                    )}
                </AnimatePresence>
            )}
        </>
    );
}
