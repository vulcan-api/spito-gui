import { Link, NavLink, Outlet } from "react-router-dom";
import Button from "./Button";
import Searchbar from "@renderer/Compontents/Searchbar";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { userAtom } from "@renderer/lib/atoms";
import { BsDoorOpenFill } from "react-icons/bs";
import { UserInfo } from "@renderer/lib/interfaces";
import { logout } from "@renderer/lib/auth";
import toast from "react-hot-toast";
import AvatarComponent from "@renderer/Compontents/AvatarComponent";

export default function Header(): JSX.Element {
  const [isUserLoggingIn, setIsUserLoggingIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useAtom(userAtom);

  const menuLinkClass = (isActive: boolean): string => {
    return `text-2xl font-roboto uppercase transition-all cursor-pointer text-center ${
      isActive ? "text-sky-400" : "text-gray-500"
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
    logout();
    toast.success("Successfully logged out");
    setUser({
      id: 0,
      username: ""
    });
    setIsMenuOpen(false);
  }

  function updateUser(user: UserInfo): void {
    setUser(user);
  }

  return (
    <>
      <AnimatePresence>
        {isUserLoggingIn && (
          <AuthModal closeModal={handleLoginModalClose} updateUser={updateUser} />
        )}
      </AnimatePresence>
      <header className="w-screen overflow-hidden py-4 px-8 flex items-center justify-between lg:gap-16 gap-8">
        <Link to="/" className="text-4xl uppercase tracking-widest font-roboto text-sky-400">
          <span className="mr-3">Spito</span>
          <span>GUI</span>
        </Link>
        <div className="w-full flex items-center justify-between gap-8">
          <Searchbar />
          <nav className="xl:flex hidden gap-16 items-center">
            <NavLink to="/marketplace" className={({ isActive }) => menuLinkClass(isActive)}>
              Marketplace
            </NavLink>
            <NavLink to="/myconfigs" className={({ isActive }) => menuLinkClass(isActive)}>
              My configs
            </NavLink>
            {user?.id ? (
              <>
                <NavLink
                  to={`/profile/${user.id}`}
                  className={({ isActive }) => {
                    return menuLinkClass(isActive) + " flex items-center gap-2 normal-case";
                  }}
                >
                  <AvatarComponent size="small" userId={user.id} username={user.username} />
                  <p>{user.username}</p>
                </NavLink>
                <span
                  className="flex items-center gap-2 text-2xl text-gray-500 font-roboto uppercase cursor-pointer hover:text-sky-500 transition-all"
                  onClick={logoutHandler}
                >
                  <p>Logout</p>
                  <BsDoorOpenFill />
                </span>
              </>
            ) : (
              <Button theme="alt" onClick={handleLoginModalOpen}>
                Login
              </Button>
            )}
          </nav>
          <div
            className="relative xl:hidden block h-6 w-6 cursor-pointer z-30"
            onClick={handleMenuStateChange}
          >
            <motion.div
              animate={isMenuOpen ? { rotate: -45, top: 8 } : { rotate: 0, top: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-1 bg-sky-400 top-0 absolute rounded-lg z-10`}
            />
            <motion.div
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-1 bg-sky-400 top-2 absolute rounded-lg z-10`}
            />
            <motion.div
              animate={isMenuOpen ? { rotate: 45, top: 8 } : { rotate: 0, top: 16 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-1 bg-sky-400 top-4 absolute rounded-lg z-10`}
            />
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-0 w-full h-full z-10 backdrop-blur-sm supports-backdrop-blur:bg-black/60"
                onClick={handleMenuStateChange}
              />
            )}
          </AnimatePresence>
          <div
            className={`xl:hidden flex flex-col items-center gap-8 px-8 py-16 md:w-1/2 w-full h-full fixed bg-bgColor z-20 ${
              isMenuOpen ? "right-0 " : "-right-full"
            } transition-all duration-500 top-0 border-l-2 md:border-sky-500 border-transparent`}
          >
            <h2 className="text-4xl text-gray-100 font-roboto">Menu</h2>
            <nav className="flex flex-col gap-8 items-center">
              <NavLink to="/" className={({ isActive }) => menuLinkClass(isActive)}>
                Main page
              </NavLink>
              <NavLink to="/marketplace" className={({ isActive }) => menuLinkClass(isActive)}>
                Marketplace
              </NavLink>
              <NavLink to="/myconfigs" className={({ isActive }) => menuLinkClass(isActive)}>
                My configs
              </NavLink>
              {user?.id ? (
                <>
                  <NavLink
                    to={`/profile/${user.id}`}
                    className={({ isActive }) => {
                      return menuLinkClass(isActive) + " flex items-center gap-2 normal-case";
                    }}
                  >
                    <AvatarComponent size="small" userId={user.id} username={user.username} />
                    <p>{user.username}</p>
                  </NavLink>
                  <span
                    className="flex items-center gap-2 text-2xl text-gray-500 font-roboto uppercase cursor-pointer hover:text-sky-500 transition-all"
                    onClick={logoutHandler}
                  >
                    <p>Logout</p>
                    <BsDoorOpenFill />
                  </span>
                </>
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
