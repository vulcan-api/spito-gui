import Button from "@renderer/Layout/Button";
import Input from "@renderer/Layout/Input";
import { changePassword } from "@renderer/lib/auth";
import { motion } from "framer-motion";
import { useRef } from "react";
import toast from "react-hot-toast";

export default function ChangePassword(): JSX.Element {
  const currentPasswordRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const newPasswordRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const repeatNewPasswordRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (
      !currentPasswordRef.current?.value ||
      !newPasswordRef.current?.value ||
      !repeatNewPasswordRef.current?.value
    ) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPasswordRef.current.value !== repeatNewPasswordRef.current?.value) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPasswordRef.current.value.length < 8) {
      toast.error("Password is too short");
      return;
    }

    const status = await changePassword(
      currentPasswordRef.current.value,
      newPasswordRef.current.value
    );
    if (status === 200) {
      toast.success("Password changed successfully");
    } else if (status === 403) {
      toast.error("Current password is incorrect");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
      key="main"
      className="flex justify-center items-center pb-28 gap-64 flex-1"
    >
      <div className="w-fit flex flex-col gap-4">
        <Input placeholder="Current password" ref={currentPasswordRef} type="password" />
        <Input placeholder="New password" ref={newPasswordRef} type="password" />
        <Input placeholder="Repeat new password" ref={repeatNewPasswordRef} type="password" />
        <Button theme="default" className="!w-full" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </motion.div>
  );
}
