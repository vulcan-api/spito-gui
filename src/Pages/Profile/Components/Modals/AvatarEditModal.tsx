import { TbArrowBackUp, TbArrowForwardUp } from "react-icons/tb";
import AvatarEditor from "react-avatar-editor";
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import {
    DialogDescription,
    DialogHeader,
    DialogContent,
    Dialog,
} from "@/Components/ui/dialog";
import { Slider } from "@/Components/ui/slider";

export default function AvatarEditModal({
    closeModal,
    newAvatarRef,
    avatarUrl,
    saveAvatarImage,
    isOpen,
}: {
    closeModal: () => void;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    newAvatarRef: any;
    avatarUrl: string;
    saveAvatarImage: () => void;
    isOpen: boolean;
}): JSX.Element {
    const [avatarEditingOptions, setAvatarEditingOptions] = useState<{
        scale: number;
        rotate: number;
    }>({
        scale: 1,
        rotate: 0,
    });

    function setRotate(direction: string): void {
        setAvatarEditingOptions({
            ...avatarEditingOptions,
            rotate:
                direction === "left"
                    ? avatarEditingOptions?.rotate - 90
                    : avatarEditingOptions?.rotate + 90,
        });
    }

    function setScale(value: number[]): void {
        setAvatarEditingOptions({
            ...avatarEditingOptions,
            scale: value[0],
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => closeModal()}>
            <DialogContent>
                <DialogHeader>Edit avatar</DialogHeader>
                <DialogDescription>
                    Use the controls to edit your avatar
                </DialogDescription>
                <AvatarEditor
                    image={avatarUrl}
                    width={400}
                    height={400}
                    borderRadius={9999}
                    color={[173, 181, 189, 0.6]}
                    scale={avatarEditingOptions?.scale || 1}
                    rotate={avatarEditingOptions?.rotate || 0}
                    className="mx-auto"
                    ref={newAvatarRef}
                />
                <div className="flex items-center gap-2 px-2 w-full">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setRotate("left");
                        }}
                    >
                        <TbArrowBackUp />
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setRotate("right");
                        }}
                    >
                        <TbArrowForwardUp />
                    </Button>
                </div>
                <Slider
                    min={1}
                    max={3}
                    onValueChange={setScale}
                    step={0.01}
                    defaultValue={[1]}
                />
                <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={saveAvatarImage}>
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
