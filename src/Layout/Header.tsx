import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import Searchbar from "../Components/Searchbar";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";
import { BsDoorOpenFill } from "react-icons/bs";
import { UserInfo } from "../lib/interfaces";
import { logout } from "../lib/auth";
import toast from "react-hot-toast";
import AvatarComponent from "../Components/AvatarComponent";
import { twMerge } from "tailwind-merge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { TbBookmark, TbHome } from "react-icons/tb";
import spitoLogo from "../../public/icon.svg";

export default function Header(): JSX.Element {
    const [isUserLoggingIn, setIsUserLoggingIn] = useState<boolean>(false);
    const [user, setUser] = useAtom(userAtom);

    const menuLinkClass = (isActive: boolean): string => {
        return twMerge(
            "text-foreground/60 hover:text-foreground/80 transition-colors flex items-center gap-2",
            isActive && "text-foreground hover:text-foreground"
        );
    };

    function handleLoginModalOpen(): void {
        setIsUserLoggingIn(true);
    }

    function handleLoginModalClose(): void {
        setIsUserLoggingIn(false);
    }

    function logoutHandler(): void {
        logout();
        toast.success("Successfully logged out");
        setUser({
            id: 0,
            username: "",
        });
    }

    function updateUser(user: UserInfo): void {
        setUser(user);
    }

    return (
        <>
            <AuthModal
                closeModal={handleLoginModalClose}
                updateUser={updateUser}
                open={isUserLoggingIn}
            />
            <header className="w-full border-b border-border/40 bg-background/60 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 max-w-screen-2xl gap-8 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={spitoLogo} alt="" className="w-6 h-6" />
                        <span className="inline-block font-bold text-2xl">
                            spito
                        </span>
                    </Link>
                    <div className="w-full flex items-center justify-between gap-8">
                        <Searchbar />
                        <nav className="xl:flex hidden gap-4 items-center">
                            {user?.id ? (
                                <>
                                    <NavLink
                                        to="/environments/saved"
                                        className={({ isActive }) =>
                                            menuLinkClass(isActive)
                                        }
                                    >
                                        <TbBookmark />
                                        Saved enviroments
                                    </NavLink>
                                    <NavLink
                                        to={`/profile/${user.id}`}
                                        className={({ isActive }) => {
                                            return twMerge(
                                                menuLinkClass(isActive),
                                                "flex items-center gap-2 normal-case"
                                            );
                                        }}
                                    >
                                        <AvatarComponent
                                            size="small"
                                            userId={user.id}
                                            username={user.username}
                                        />
                                        <p>{user.username}</p>
                                    </NavLink>
                                    <Button
                                        onClick={logoutHandler}
                                        variant="ghost"
                                        className="gap-2"
                                    >
                                        <p>Logout</p>
                                        <BsDoorOpenFill />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={handleLoginModalOpen}
                                >
                                    Login
                                </Button>
                            )}
                        </nav>
                        <Sheet>
                            <SheetTrigger className="xl:hidden block">
                                <Button variant="outline">Open menu</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-8 mt-16 items-center">
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) =>
                                            menuLinkClass(isActive)
                                        }
                                    >
                                        <TbHome />
                                        Home
                                    </NavLink>
                                    {user?.id ? (
                                        <>
                                            <NavLink
                                                to="/environments/saved"
                                                className={({ isActive }) =>
                                                    menuLinkClass(isActive)
                                                }
                                            >
                                                <TbBookmark />
                                                Saved environments
                                            </NavLink>
                                            <NavLink
                                                to={`/profile/${user.id}`}
                                                className={({ isActive }) => {
                                                    return (
                                                        menuLinkClass(
                                                            isActive
                                                        ) +
                                                        " flex items-center gap-2 normal-case"
                                                    );
                                                }}
                                            >
                                                <AvatarComponent
                                                    size="small"
                                                    userId={user.id}
                                                    username={user.username}
                                                />
                                                <p>{user.username}</p>
                                            </NavLink>
                                            <Button
                                                onClick={logoutHandler}
                                                variant="outline"
                                            >
                                                <p>Logout</p>
                                                <BsDoorOpenFill />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="default"
                                            onClick={handleLoginModalOpen}
                                        >
                                            Login
                                        </Button>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
            <Outlet />
        </>
    );
}
