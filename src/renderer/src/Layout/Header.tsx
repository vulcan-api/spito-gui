import { Link, NavLink, Outlet } from "react-router-dom";
import Button from "./Button";
import Searchbar from "@renderer/Compontents/Searchbar";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { AnimatePresence } from "framer-motion";

export default function Header(): JSX.Element {
  const [isUserLoggingIn, setIsUserLoggingIn] = useState<boolean>(false);

  const menuLinkClass = (isActive: boolean): string => {
    return `text-2xl roboto uppercase transition-all ${
      isActive ? "text-gray-100" : "text-gray-500"
    }`;
  };

  function handleLoginModalOpen(): void {
    setIsUserLoggingIn(true);
  }

  function handleLoginModalClose(): void {
    setIsUserLoggingIn(false);
  }

  return (
    <>
      <AnimatePresence>
        {isUserLoggingIn && <AuthModal closeModal={handleLoginModalClose} />}
      </AnimatePresence>
      <header className="w-full py-4 px-8 flex items-center justify-between">
        <Link to="/" className="text-5xl uppercase text-teal-500 tracking-widest roboto">
          SPITO
        </Link>
        <Searchbar />
        <nav className="flex gap-16 items-center">
          <NavLink to="/configs" className={({ isActive }) => menuLinkClass(isActive)}>
            Configs
          </NavLink>
          <Button theme="alt" onClick={handleLoginModalOpen}>
            Login
          </Button>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
