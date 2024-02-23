import { useRef, useState } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { getUserInfo, login, register, verify2FA } from "../lib/auth";
import toast from "react-hot-toast";
import { UserInfo } from "../lib/interfaces";
import AuthCode from "react-auth-code-input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

export default function AuthModal({
    closeModal,
    updateUser,
    open,
}: {
    closeModal: () => void;
    updateUser: (user: UserInfo) => void;
    open: boolean;
}): JSX.Element {
    const usernameRef: React.RefObject<HTMLInputElement> =
        useRef<HTMLInputElement>(null);
    const passwordRef: React.RefObject<HTMLInputElement> =
        useRef<HTMLInputElement>(null);
    const repeatPasswordRef: React.RefObject<HTMLInputElement> =
        useRef<HTMLInputElement>(null);
    const [email, setEmail] = useState<string>("");
    const [isUserRegistering, setIsUserRegistering] = useState<boolean>(false);
    const [isTwoFAEnabled, setIsTwoFAEnabled] = useState<boolean>(false);
    const [twoFACode, setTwoFACode] = useState<string>("");

    function changeAuthMethodHandler(): void {
        setIsUserRegistering((prev: boolean) => !prev);
    }

    const handleRegister = async (): Promise<void> => {
        if (
            !usernameRef.current?.value ||
            !email ||
            !passwordRef.current?.value
        ) {
            return;
        }
        if (passwordRef.current?.value !== repeatPasswordRef.current?.value) {
            toast.error("Passwords do not match");
            return;
        }
        const toastId = toast.loading("Registering...");
        const status = await register(
            usernameRef.current?.value,
            email,
            passwordRef.current?.value
        );
        if (status === 201) {
            toast.success("Successfully registered", {
                id: toastId,
            });
            setIsUserRegistering(false);
        } else if (status === 403) {
            toast.error("Email or username already in use", {
                id: toastId,
            });
        } else {
            toast.error("Failed to register", {
                id: toastId,
            });
        }
    };

    const handleLogin = async (): Promise<void> => {
        if (!email || !passwordRef.current?.value) {
            return;
        }
        const toastId = toast.loading("Logging in...");
        const status = await login(email, passwordRef.current?.value);
        if (status === 600) {
            setIsTwoFAEnabled(true);
            toast.dismiss(toastId);
        } else if (status === 200) {
            toast.success("Successfully logged in", {
                id: toastId,
            });
            const info: UserInfo | null = getUserInfo();
            if (info) updateUser(info);
            closeModal();
        } else if (status === 403) {
            toast.error("Wrong email or password!", {
                id: toastId,
            });
        } else {
            toast.error("Failed to log in", {
                id: toastId,
            });
        }
    };

    function handleAuthCodeState(res: string): void {
        setTwoFACode(res);
    }

    async function submit2FA(): Promise<void> {
        if (twoFACode?.length !== 6) {
            return;
        }
        const toastId = toast.loading("Logging in...");
        const response = await verify2FA(email || "", twoFACode);
        if (response) {
            toast.success("Successfully logged in", {
                id: toastId,
            });
            const info: UserInfo | null = getUserInfo();
            if (info) updateUser(info);
            closeModal();
        }
    }

    return (
        <Dialog open={open} onOpenChange={closeModal}>
            <DialogContent>
                {isTwoFAEnabled ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Enter your 2FA token.</DialogTitle>
                        </DialogHeader>
                        <AuthCode
                            onChange={handleAuthCodeState}
                            allowedCharacters="numeric"
                            containerClassName="flex items-center justify-center gap-4"
                            inputClassName="w-8 h-10 bg-transparent border-2 border-bgLighter text-gray-400 rounded-lg text-3xl text-center shadow-darkMain"
                        />
                        <Button
                            variant="default"
                            className="mx-auto"
                            onClick={submit2FA}
                        >
                            Submit
                        </Button>
                    </>
                ) : isUserRegistering ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Register</DialogTitle>
                        </DialogHeader>
                        <Input placeholder="Username" ref={usernameRef} />
                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            ref={passwordRef}
                        />
                        <Input
                            placeholder="Repeat password"
                            type="password"
                            ref={repeatPasswordRef}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleLogin()
                            }
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="!w-full"
                                onClick={changeAuthMethodHandler}
                            >
                                Back to Login
                            </Button>
                            <Button
                                variant="default"
                                className="!w-full"
                                onClick={handleRegister}
                            >
                                Register
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-center text-6xl font-roboto mb-8">
                            Login
                        </h2>
                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            ref={passwordRef}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleLogin()
                            }
                        />
                        <p className="text-center cursor-pointer">
                            Forgot password?
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="!w-full"
                                onClick={changeAuthMethodHandler}
                            >
                                New? Register
                            </Button>
                            <Button
                                variant="default"
                                className="!w-full"
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
