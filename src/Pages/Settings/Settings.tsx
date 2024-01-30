import { useEffect, useState } from "react";
import MainSettings from "./Sections/MainSettings";
import SettingsSidebar from "./SettingsSidebar";
import { AnimatePresence, motion } from "framer-motion";
import Tokens from "./Sections/Tokens";
import { currentPageType } from "../../lib/interfaces";
import { userAtom } from "../../lib/atoms";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import TwoFa from "./Sections/TwoFA";
import ChangePassword from "./Sections/ChangePassword";

export default function Settings(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<currentPageType>("about");

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
      case "changePassword":
        return <ChangePassword />;
      default:
        return <MainSettings />;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-row gap-4 w-full overflow-y-hidden"
    >
      <SettingsSidebar
        page={currentPage}
        setPage={setCurrentPage}
        loggedUserData={loggedUserData}
      />
      <AnimatePresence mode="wait">{displayCurrentPage()}</AnimatePresence>
    </motion.div>
  );
}
