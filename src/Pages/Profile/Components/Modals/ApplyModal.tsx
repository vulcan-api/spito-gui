import { Dialog, DialogContent, DialogHeader } from "@/Components/ui/dialog";
import { useEffect, useState } from "react";

export default function ApplyModal({
    isOpen,
    close,
}: {
    isOpen: boolean;
    close: () => void;
}): JSX.Element {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const logs = [
        "sudo spito check . lightdm",
        "[sudo] password for bstrama:",
        "   _______  ______________",
        "  / __/ _ \\/  _/_  __/ __ \\",
        " _\\ \\/ ___// /  / / / /_/ /",
        "/___/_/  /___/ /_/  \\____/",
        "Installing pacman packages...  ",
        "Installing AUR package lightdm-webkit2-theme-glorious... 100% |█████████████████████| (1/1) ",
        "Rule lightdm successfuly passed requirements",
        "Would you like to apply this rule's changes? [y/N]: y",
        "Checking Virtual Requirements and Changes Tree (VRCT) integrity...",
        "Symulating final changes layer...",
        "Calculating revert steps and serializing revert data...",
        "Cleaning up...",
        "[important] In order to revert changes, use this command:  spito revert 561",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev < 14 ? prev + 1 : prev));
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={() => close()}>
            <DialogContent className="sm:max-w-[425px] p-4">
                <DialogHeader title="Applying environment" />
                <div className="flex flex-col gap-4 max-w-[395px]">
                    <p className="text-base text-muted-foreground">
                        Applying...
                    </p>
                    <div className="w-full h-1 bg-accent rounded-full">
                        <div
                            className="bg-primary h-full rounded-full"
                            style={{
                                width: `${(currentIndex / logs.length) * 100}%`,
                            }}
                        />
                    </div>
                    <div className="w-full h-32 bg-accent rounded-xl border overflow-y-auto p-4">
                        {logs
                            .slice(
                                currentIndex - 3 >= 0 ? currentIndex - 3 : 0,
                                currentIndex
                            )
                            .map((log, i) => (
                                <p
                                    key={i}
                                    className="text-xs text-muted-foreground"
                                >
                                    {log}
                                </p>
                            ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
