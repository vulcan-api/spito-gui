import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { BsX } from "react-icons/bs";
import Input from "./Input";
import Button from "./Button";
import { login, register } from "../lib/auth";
import toast from "react-hot-toast";

export default function AuthModal({
  closeModal
}: {
  closeModal: any;
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
      closeModal();
    } else {
      toast.error("Failed to log in", {
        id: toastId
      });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center absolute left-0 top-0 w-screen h-screen bg-[#00000080] z-10"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`w-1/4 h-1/2 bg-bgColor border-2 rounded-xl border-teal-500 text-gray-100 relative p-8 py-16 ${
          isUserRegistering ? "h-2/3" : "h-1/2"
        }`}
      >
        <BsX
          className="absolute text-3xl right-4 top-4 cursor-pointer hover:text-emerald-500 transition-colors"
          onClick={closeModal}
        />
        {isUserRegistering ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col gap-4 justify-between"
          >
            <h2 className="text-center text-4xl roboto mb-4">Register</h2>
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
            className="w-full h-full flex flex-col gap-4 justify-between"
          >
            <BsX
              className="absolute text-3xl right-4 top-4 cursor-pointer hover:text-emerald-500 transition-colors"
              onClick={closeModal}
            />
            <h2 className="text-center text-4xl roboto mb-8">Login</h2>
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
    </motion.div>
  );
}
