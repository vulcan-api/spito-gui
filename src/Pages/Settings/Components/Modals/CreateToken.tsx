import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { createToken } from "../../../../lib/tokens";
import { useRef, useState } from "react";
import { DatePicker } from "@/Components/ui/date-picker";
import { Checkbox } from "@/Components/ui/checkbox";

export default function CreateToken({
    open,
    closeModal,
}: {
    closeModal: (token?: string) => void;
    open: boolean;
}): JSX.Element {
    const nameRef: React.RefObject<HTMLInputElement> =
        useRef<HTMLInputElement>(null);
    const [hasExpirationDate, setHasExpirationDate] = useState<boolean>(false);
    const [expiresAt, setExpiresAt] = useState<Date>(new Date());

    async function formSubmitHandler(): Promise<void> {
        const name = nameRef.current?.value as string;
        const data = await createToken(
            name,
            hasExpirationDate ? expiresAt : undefined
        );
        closeModal(data.token);
    }

    return (
        <Dialog open={open} onOpenChange={() => closeModal()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new token</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    The names are illustrative, set one that will easily remind
                    you what the token is used for
                </DialogDescription>
                <form className="flex flex-col w-full gap-4 relative">
                    <Input
                        placeholder="Name"
                        name="name"
                        type="text"
                        ref={nameRef}
                    />
                    <div className="items-top flex space-x-2">
                        <Checkbox
                            checked={hasExpirationDate}
                            onCheckedChange={() =>
                                setHasExpirationDate(!hasExpirationDate)
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Set an expiration date (recommended)
                            </label>
                            <p className="text-xs text-borderGray font-poppins">
                                Or your token will never expire
                            </p>
                        </div>
                    </div>
                    {hasExpirationDate && (
                        <DatePicker
                            onChange={(date) => setExpiresAt(date)}
                            value={new Date(expiresAt as Date)}
                        />
                    )}
                    <Button
                        variant="default"
                        onClick={(e) => {
                            e.preventDefault();
                            formSubmitHandler();
                        }}
                    >
                        Create
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
