import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { BsX } from "react-icons/bs";
import Input from "./Input";
import Button from "./Button";
import { getUserInfo, login, register } from "../lib/auth";
import toast from "react-hot-toast";
import { UserInfo } from "@renderer/lib/interfaces";

export default function AuthModal({
  closeModal,
  updateUser
}: {
  closeModal: () => void;
  updateUser: (user: UserInfo) => void;
}): JSX.Element {
  const emailRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const usernameRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const passwordRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const repeatPasswordRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const [isUserRegistering, setIsUserRegistering] = useState<boolean>(false);

  function changeAuthMethodHandler(): void {
    setIsUserRegistering((prev: boolean) => !prev);
  }
  const handleRegister = async (): Promise<void> => {
    if (!usernameRef.current?.value || !emailRef.current?.value || !passwordRef.current?.value) {
      return;
    }
    if (passwordRef.current?.value !== repeatPasswordRef.current?.value) {
      toast.error("Passwords do not match");
      return;
    }
    const toastId = toast.loading("Registering...");
    const status = await register(
      usernameRef.current?.value,
      emailRef.current?.value,
      passwordRef.current?.value
    );
    if (status === 201) {
      toast.success("Successfully registered", {
        id: toastId
      });
      setIsUserRegistering(false);
    } else {
      toast.error("Failed to register", {
        id: toastId
      });
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!emailRef.current?.value || !passwordRef.current?.value) {
      return;
    }
    const toastId = toast.loading("Logging in...");
    const status = await login(emailRef.current?.value, passwordRef.current?.value);
    if (status === 200) {
      toast.success("Successfully logged in", {
        id: toastId
      });
      const info: UserInfo | null = getUserInfo();
      if (info) updateUser(info);
      closeModal();
    } else if (status === 403) {
      toast.error("Wrong email or password!", {
        id: toastId
      });
    } else {
      toast.error("Failed to log in", {
        id: toastId
      });
    }
  };
  return (
    <div className="flex items-center justify-center absolute left-0 top-0 w-screen h-screen z-40">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute w-screen h-screen backdrop-blur-sm supports-backdrop-blur:bg-black/60"
        onClick={closeModal}
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        className={`2xl:w-1/4 xl:w-1/3 md:w-1/2 w-full bg-bgColor md:border-2 md:rounded-xl md:border-bgLight shadow-darkMain text-gray-100 relative md:p-8 md:py-16 p-24 h-full ${
          isUserRegistering ? "md:h-2/3 min-h-[700px]" : "md:h-1/2 min-h-[500px]"
        }`}
      >
        <BsX
          className="absolute text-3xl right-4 top-4 cursor-pointer hover:text-sky-500 transition-colors"
          onClick={closeModal}
        />
        {isUserRegistering ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col gap-8 md:justify-between justify-center"
          >
            <h2 className="text-center text-6xl font-roboto mb-4">Register</h2>
            <Input placeholder="Username" ref={usernameRef} />
            <Input placeholder="Email" type="email" ref={emailRef} />
            <Input placeholder="Password" type="password" ref={passwordRef} />
            <Input placeholder="Repeat password" type="password" ref={repeatPasswordRef} />
            <div className="flex items-center gap-2">
              <Button theme="alt" className="!w-full" onClick={changeAuthMethodHandler}>
                Back to Login
              </Button>
              <Button theme="default" className="!w-full" onClick={handleRegister}>
                Register
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col gap-4 md:justify-between justify-center"
          >
            <h2 className="text-center text-6xl font-roboto mb-8">Login</h2>
            <Input placeholder="Email" type="email" ref={emailRef} />
            <Input placeholder="Password" type="password" ref={passwordRef} />
            <p className="text-center cursor-pointer">Forgot password?</p>
            <div className="flex items-center gap-2">
              <Button theme="alt" className="!w-full" onClick={changeAuthMethodHandler}>
                New? Register
              </Button>
              <Button theme="default" className="!w-full" onClick={handleLogin}>
                Login
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
