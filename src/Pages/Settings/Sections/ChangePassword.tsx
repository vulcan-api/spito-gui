import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { changePassword } from "../../../lib/auth";
import { motion } from "framer-motion";
import { useRef } from "react";
import toast from "react-hot-toast";
import { Label } from "@/Components/ui/label";

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
            <div className="flex flex-col gap-4 w-1/4">
                <p className="text-4xl text-gray-400 font-poppins mb-8 text-center">
                    Change password
                </p>
                <Label>Enter current password:</Label>
                <Input
                    placeholder="Current password"
                    ref={currentPasswordRef}
                    type="password"
                />
                <Label>Enter new password:</Label>
                <Input
                    placeholder="New password"
                    ref={newPasswordRef}
                    type="password"
                />
                <Input
                    placeholder="Repeat new password"
                    ref={repeatNewPasswordRef}
                    type="password"
                />
                <Button
                    variant="default"
                    className="!w-full mt-2"
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </div>
        </motion.div>
    );
}
