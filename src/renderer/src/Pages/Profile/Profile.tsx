import { ProfileInterface } from "@renderer/lib/interfaces";
import { getUserProfile } from "@renderer/lib/user";
import { motion, useIsPresent } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TbBook, TbBriefcase, TbFile, TbFolder, TbPlus, TbSettingsFilled } from "react-icons/tb/";
import { useAtomValue } from "jotai";
import { userAtom } from "@renderer/lib/atoms";
import Overview from "./Pages/Overview";
import Rules from "./Pages/Rules";
import Rulesets from "./Pages/Rulesets";
import Enviroments from "./Pages/Enviroments";
import ManageContentModal from "./Components/Modals/ManageContentModal";
import AvatarComponent from "@renderer/Compontents/AvatarComponent";

type site = "Main" | "Rules" | "Rulesets" | "Enviroments";

export default function Profile(): JSX.Element {
  const [userData, setUserData] = useState<ProfileInterface>();
  const [site, setSite] = useState<site>("Main");
  const [isUserAddingContent, setIsUserAddingContent] = useState<boolean>(false);
  const loggedUserData = useAtomValue(userAtom);
  const navigate = useNavigate();

  const { userId = 0 } = useParams<{ userId: string }>();
  const isPresent = useIsPresent();

  async function fetchData(): Promise<void> {
    const data = await getUserProfile(+userId);
    if (data.username) {
      setUserData(data);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleAddingContent(): void {
    setIsUserAddingContent(!isUserAddingContent);
  }

  function tabClasses(tab: site): string {
    return `font-roboto transition-all px-8 py-2 w-full border-b-2 flex items-center gap-2 justify-center ${
      site === tab
        ? "text-gray-300 border-sky-400"
        : "text-gray-400 cursor-pointer hover:border-sky-700 border-bgLight hover:bg-bgLight"
    }`;
  }

  function displayCorrectSite(): JSX.Element {
    switch (site) {
      case "Main":
        return <Overview />;
      case "Rules":
        return <Rules />;
      case "Rulesets":
        return <Rulesets />;
      case "Enviroments":
        return <Enviroments />;
    }
  }

  return (
    <div className="flex-1 w-4/5 mx-auto flex flex-col px-16 overflow-y-auto my-4">
      {isUserAddingContent && <ManageContentModal closeModal={handleAddingContent} />}
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
            <h1 className="text-gray-100 text-4xl font-roboto">{userData?.username}</h1>
            <p className="text-gray-400 text-lg font-poppins w-[260px] line-clamp-4 break-all overflow-hidden">
              {userData?.description || "This user has no description yet!"}
            </p>
          </div>
        </div>
        <div className="h-full w-[2px] bg-bgLight rounded-full" />
        <div className="flex-1 gap-8 h-fit duration-300 text-xl text-gray-100 font-roboto bg-bgColor">
          <div className="flex items-center justify-between relative">
            <p onClick={() => setSite("Main")} className={tabClasses("Main") + " rounded-tl-lg"}>
              <TbBook />
              OVERVIEW
            </p>
            <p onClick={() => setSite("Rules")} className={tabClasses("Rules")}>
              <TbFile />
              RULES
            </p>
            <p onClick={() => setSite("Rulesets")} className={tabClasses("Rulesets")}>
              <TbFolder />
              RULESETS
            </p>
            <p
              onClick={() => setSite("Enviroments")}
              className={tabClasses("Enviroments") + " rounded-tr-lg"}
            >
              <TbBriefcase />
              ENVIROMENTS
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
          <div className="flex flex-col gap-8 p-4 text-gray-400">{displayCorrectSite()}</div>
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.6, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen z-50"
      />
    </div>
  );
}
