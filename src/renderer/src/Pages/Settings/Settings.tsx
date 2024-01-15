import { useState } from "react";
import MainSettings from "./Sections/MainSettings";
import SettingsSidebar from "./SettingsSidebar";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import Tokens from "./Sections/Tokens";

type currentPageType = "main" | "tokens";

export default function Settings(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<currentPageType>("main");
  const isPresent = useIsPresent();

  function displayCurrentPage(): JSX.Element {
    switch (currentPage) {
      case "main":
        return <MainSettings />;
      case "tokens":
        return <Tokens />;
    }
  }

  return (
    <div className="flex-1 flex flex-row gap-4 w-full overflow-y-hidden">
      <SettingsSidebar page={currentPage} setPage={setCurrentPage} />
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
