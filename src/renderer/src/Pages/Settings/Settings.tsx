import { useState } from "react";
import MainSettings from "./Sections/MainSettings";
import SettingsSidebar from "./SettingsSidebar";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";

type currentPageType = "main" | "tokens";

export default function Settings(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<currentPageType>("main");
  const isPresent = useIsPresent();

  function displayCurrentPage(): JSX.Element {
    switch (currentPage) {
      case "main":
        return <MainSettings />;
      case "tokens":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0 }}
            key="tokens"
          >
            tokens
          </motion.div>
        );
    }
  }

  return (
    <div className="flex-1 flex flex-row gap-4 w-full">
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
