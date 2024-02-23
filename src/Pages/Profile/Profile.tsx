import { ProfileInterface } from "../../lib/interfaces";
import { getUserProfile } from "../../lib/user";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    TbBook,
    TbBriefcase,
    TbFile,
    TbFolder,
    TbPlus,
    TbSettingsFilled,
} from "react-icons/tb";
import { useAtomValue } from "jotai";
import { userAtom } from "../../lib/atoms";
import Overview from "./Pages/Overview";
import Rules from "./Pages/Rules";
import Rulesets from "./Pages/Rulesets";
import Environments from "./Pages/Environments";
import ManageContentModal from "./Components/Modals/ManageContentModal";
import AvatarComponent from "../../Components/AvatarComponent";
import { twMerge } from "tailwind-merge";
import { Separator } from "@/Components/ui/separator";

type site = "Main" | "Rules" | "Rulesets" | "Environments";

export default function Profile(): JSX.Element {
    const [userData, setUserData] = useState<ProfileInterface>();
    const [site, setSite] = useState<site>("Main");
    const [isUserAddingContent, setIsUserAddingContent] =
        useState<boolean>(false);
    const loggedUserData = useAtomValue(userAtom);
    const navigate = useNavigate();

    const { userId = 0 } = useParams<{ userId: string }>();

    async function fetchData(): Promise<void> {
        const response = await getUserProfile(+userId);
        if (response.status === 200) {
            setUserData(response.data);
        } else {
            navigate("/");
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    function handleAddingContent(): void {
        setIsUserAddingContent(!isUserAddingContent);
    }

    function tabClasses(tab: site): string {
        return twMerge(
            "font-roboto transition-all px-8 py-2 w-full border-b-2 flex items-center gap-2 justify-center",
            site === tab
                ? "text-gray-300 border-sky-400"
                : "text-gray-400 cursor-pointer hover:border-sky-700 border-bgLight hover:bg-bgLight"
        );
    }

    function displayCorrectSite(): JSX.Element {
        switch (site) {
            case "Main":
                return <Overview />;
            case "Rules":
                return <Rules />;
            case "Rulesets":
                return <Rulesets />;
            case "Environments":
                return <Environments />;
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="profile"
            transition={{ duration: 0.4 }}
            className="flex-1 w-4/5 mx-auto flex flex-col px-16 overflow-y-auto my-4"
        >
            {isUserAddingContent && (
                <ManageContentModal closeModal={handleAddingContent} />
            )}
            <div className="w-full pb-8 flex gap-8 py-8">
                <div className="h-fit w-1/4 flex flex-col gap-4 px-8 py-8 duration-300 relative bg-bgColor">
                    {loggedUserData?.id === +userId && (
                        <TbSettingsFilled
                            onClick={() => navigate("/settings")}
                            className="absolute right-4 top-4 text-2xl text-gray-400 transition-all hover:text-sky-500 hover:rotate-45 cursor-pointer duration-300"
                        />
                    )}
                    <AvatarComponent
                        className="shadow-darkMain"
                        username={userData?.username || ""}
                        size="big"
                        userId={+userId}
                    />
                    <div className="flex flex-col gap-4 w-full">
                        <h1 className="text-gray-100 text-3xl font-roboto text-center">
                            {userData?.username}
                        </h1>
                        <p className="text-gray-400 text-lg font-poppins line-clamp-4 break-word overflow-hidden text-center">
                            {userData?.description ||
                                "This user has no description yet!"}
                        </p>
                    </div>
                </div>
                <Separator orientation="vertical" />
                <div className="flex-1 gap-8 h-fit duration-300 text-xl text-gray-100 font-roboto bg-bgColor">
                    <div className="flex items-center justify-between relative">
                        <p
                            onClick={() => setSite("Main")}
                            className={tabClasses("Main") + " rounded-tl-lg"}
                        >
                            <TbBook />
                            OVERVIEW
                        </p>
                        <p
                            onClick={() => setSite("Rules")}
                            className={tabClasses("Rules")}
                        >
                            <TbFile />
                            RULES
                        </p>
                        <p
                            onClick={() => setSite("Rulesets")}
                            className={tabClasses("Rulesets")}
                        >
                            <TbFolder />
                            RULESETS
                        </p>
                        <p
                            onClick={() => setSite("Environments")}
                            className={
                                tabClasses("Environments") + " rounded-tr-lg"
                            }
                        >
                            <TbBriefcase />
                            ENVIRONMENTS
                        </p>
                        {loggedUserData?.id === +userId && (
                            <p
                                onClick={handleAddingContent}
                                className="absolute w-8 h-8 transition-colors duration-300 text-white bg-sky-500 hover:bg-sky-700 -right-10 rounded-full flex items-center justify-center cursor-pointer"
                            >
                                <TbPlus />
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-8 p-4 text-gray-400">
                        {displayCorrectSite()}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
