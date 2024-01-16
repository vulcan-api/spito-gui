import { useEffect, useState } from "react";
import MainSettings from "./Sections/MainSettings";
import SettingsSidebar from "./SettingsSidebar";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import Tokens from "./Sections/Tokens";
import { currentPageType } from "@renderer/lib/interfaces";
import { userAtom } from "@renderer/lib/atoms";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import TwoFa from "./Sections/TwoFA";

export default function Settings(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<currentPageType>("about");
  const isPresent = useIsPresent();
  const loggedUserData = useAtomValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedUserData.id) {
      navigate("/");
    }
  }, [loggedUserData]);

  function displayCurrentPage(): JSX.Element {
    switch (currentPage) {
      case "about":
        return <MainSettings />;
      case "tokens":
        return <Tokens />;
      case "2fa":
        return <TwoFa />;
      default:
        return <MainSettings />;
    }
  }

  return (
    <div className="flex-1 flex flex-row gap-4 w-full overflow-y-hidden">
      <SettingsSidebar
        page={currentPage}
        setPage={setCurrentPage}
        loggedUserData={loggedUserData}
      />
      <AnimatePresence mode="wait">{displayCurrentPage()}</AnimatePresence>
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
