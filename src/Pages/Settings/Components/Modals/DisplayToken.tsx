import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { CopyIcon } from "@radix-ui/react-icons";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import toast from "react-hot-toast";

export default function DisplayToken({
    open,
    closeModal,
    token,
}: {
    closeModal: () => void;
    token: string;
    open: boolean;
}): JSX.Element {
    function copyTokenToClipoard(): void {
        navigator.clipboard.writeText(token);
        toast.success("Token copied to clipboard!");
    }

    return (
        <Dialog open={open} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Your token</DialogTitle>
                    <DialogDescription>
                        Copy and save it somewhere safe. You will not be able to
                        see it again!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="token" className="sr-only">
                            Token
                        </Label>
                        <Input id="token" defaultValue={token} readOnly />
                    </div>
                    <Button
                        size="sm"
                        className="px-3"
                        onClick={copyTokenToClipoard}
                    >
                        <span className="sr-only">Copy</span>
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
