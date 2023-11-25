import { Link, NavLink, Outlet } from "react-router-dom";
import Button from "./Button";
import Searchbar from "@renderer/Compontents/Searchbar";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { userAtom } from "@renderer/lib/atoms";
import { BsDoorOpenFill } from "react-icons/bs";

export default function Header(): JSX.Element {
  const [isUserLoggingIn, setIsUserLoggingIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useAtom(userAtom);

  const menuLinkClass = (isActive: boolean): string => {
    return `text-2xl roboto uppercase transition-all ${
      isActive ? "text-emerald-500" : "text-gray-500"
    }`;
  };

  function handleLoginModalOpen(): void {
    setIsUserLoggingIn(true);
    setIsMenuOpen(false);
  }

  function handleLoginModalClose(): void {
    setIsUserLoggingIn(false);
  }

  function handleMenuStateChange(): void {
    setIsMenuOpen((prev: boolean) => !prev);
  }

  function logoutHandler(): void {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <>
      <AnimatePresence>
        {isUserLoggingIn && <AuthModal closeModal={handleLoginModalClose} setUser={setUser} />}
      </AnimatePresence>
      <header className="w-screen overflow-hidden py-4 px-8 flex items-center justify-between md:gap-16 gap-8">
        <Link to="/" className="text-5xl uppercase text-emerald-500 tracking-widest roboto">
          SPITO
        </Link>
        <div className="w-full flex items-center justify-between gap-8">
          <Searchbar />
          <nav className="xl:flex hidden gap-16 items-center">
            <NavLink to="/configs" className={({ isActive }) => menuLinkClass(isActive)}>
              Configs
            </NavLink>
            {user?.id ? (
              <span className="flex items-center gap-2 text-2xl text-gray-500 roboto uppercase cursor-pointer hover:text-emerald-500 transition-all">
                <p>Logout</p>
                <BsDoorOpenFill onClick={logoutHandler} />
              </span>
            ) : (
              <Button theme="alt" onClick={handleLoginModalOpen}>
                Login
              </Button>
            )}
          </nav>
          <div
            className="relative xl:hidden block h-6 w-6 cursor-pointer"
            onClick={handleMenuStateChange}
          >
            <motion.div
              animate={isMenuOpen ? { rotate: -45, top: 8 } : { rotate: 0, top: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-1 bg-emerald-400 top-0 absolute rounded-lg z-10`}
            />
            <motion.div
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-1 bg-emerald-400 top-2 absolute rounded-lg z-10`}
            />
            <motion.div
              animate={isMenuOpen ? { rotate: 45, top: 8 } : { rotate: 0, top: 16 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-1 bg-emerald-400 top-4 absolute rounded-lg z-10`}
            />
          </div>
          <div
            className={`xl:hidden flex flex-col items-center gap-8 px-8 py-16 w-1/2 h-full fixed bg-bgColor ${
              isMenuOpen ? "right-0 " : "-right-full"
            } transition-all duration-500 top-0 border-l-2 border-emerald-500`}
          >
            <h2 className="text-4xl text-gray-100 roboto">Menu</h2>
            <nav className="flex flex-col gap-8 items-center">
              <NavLink to="/" className={({ isActive }) => menuLinkClass(isActive)}>
                Main page
              </NavLink>
              <NavLink to="/configs" className={({ isActive }) => menuLinkClass(isActive)}>
                Configs
              </NavLink>
              {user?.id ? (
                <span className="flex items-center gap-2 text-2xl text-gray-500 roboto uppercase cursor-pointer hover:text-emerald-500 transition-all">
                  <p>Logout</p>
                  <BsDoorOpenFill onClick={logoutHandler} />
                </span>
              ) : (
                <Button theme="default" onClick={handleLoginModalOpen}>
                  Login
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}
