import Button from "../../../Layout/Button";
import Input from "../../../Layout/Input";
import { changePassword } from "../../../lib/auth";
import { motion } from "framer-motion";
import { useRef } from "react";
import toast from "react-hot-toast";

export default function ChangePassword(): JSX.Element {
    const currentPasswordRef: React.RefObject<HTMLInputElement> =
        useRef<HTMLInputElement>(null);
    const newPasswordRef: React.RefObject<HTMLInputElement> =
        useRef<HTMLInputElement>(null);
    const repeatNewPasswordRef: React.RefObject<HTMLInputElement> =
        useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        if (
            !currentPasswordRef.current?.value ||
            !newPasswordRef.current?.value ||
            !repeatNewPasswordRef.current?.value
        ) {
            toast.error("Please fill all fields");
            return;
        }
        if (
            newPasswordRef.current.value !== repeatNewPasswordRef.current?.value
        ) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPasswordRef.current.value.length < 8) {
            toast.error("Password is too short");
            return;
        }

        const toastId = toast.loading("Changing password...");
        const status = await changePassword(
            currentPasswordRef.current.value,
            newPasswordRef.current.value
        );
        if (status === 200) {
            toast.success("Password changed successfully", {
                id: toastId,
            });
        } else if (status === 403) {
            toast.error("Current password is incorrect", {
                id: toastId,
            });
        } else {
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0 }}
            key="main"
            className="flex justify-center items-center flex-1"
        >
            <div className="flex items-center flex-col gap-4 w-1/4">
                <p className="text-4xl text-gray-400 font-roboto mb-8">
                    Change password
                </p>
                <p className="text-xl text-bgLighter font-roboto text-left w-full">
                    Enter current password:
                </p>
                <Input
                    placeholder="Current password"
                    ref={currentPasswordRef}
                    type="password"
                    containerClassName="!w-full"
                />
                <p className="text-xl text-bgLighter font-roboto text-left w-full mt-2">
                    Enter new password:
                </p>
                <Input
                    placeholder="New password"
                    ref={newPasswordRef}
                    type="password"
                    containerClassName="!w-full"
                />
                <Input
                    placeholder="Repeat new password"
                    ref={repeatNewPasswordRef}
                    type="password"
                    containerClassName="!w-full"
                />
                <Button
                    theme="default"
                    className="!w-full mt-2"
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </div>
        </motion.div>
    );
}
