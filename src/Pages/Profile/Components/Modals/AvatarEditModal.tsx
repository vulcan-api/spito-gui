import { TbArrowBackUp, TbArrowForwardUp, TbX } from "react-icons/tb";
import AvatarEditor from "react-avatar-editor";
import Button from "../../../../Layout/Button";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AvatarEditModal({
    closeModal,
    newAvatarRef,
    avatarUrl,
    saveAvatarImage,
}: {
    closeModal: () => void;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    newAvatarRef: any;
    avatarUrl: string;
    saveAvatarImage: () => void;
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

    function setScale(event: React.ChangeEvent<HTMLInputElement>): void {
        setAvatarEditingOptions({
            ...avatarEditingOptions,
            scale: Number(event.target.value),
        });
    }

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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="2xl:w-1/4 xl:w-1/3 md:w-1/2 w-full bg-bgColor md:border-2 md:rounded-xl md:border-bgLight text-gray-100 shadow-darkMain relative p-8 pt-20 flex flex-col items-center gap-8"
            >
                <TbX
                    onClick={closeModal}
                    className="absolute left-4 top-4 text-3xl hover:text-sky-500 transition-colors cursor-pointer"
                />
                <AvatarEditor
                    image={avatarUrl}
                    width={288}
                    height={288}
                    borderRadius={150}
                    color={[173, 181, 189, 0.6]}
                    scale={avatarEditingOptions?.scale || 1}
                    rotate={avatarEditingOptions?.rotate || 0}
                    ref={newAvatarRef}
                />
                <div className="flex items-center gap-2 px-2">
                    <Button
                        theme="alt"
                        onClick={() => {
                            setRotate("left");
                        }}
                    >
                        <TbArrowBackUp />
                    </Button>
                    <Button
                        theme="alt"
                        onClick={() => {
                            setRotate("right");
                        }}
                    >
                        <TbArrowForwardUp />
                    </Button>
                </div>
                <input
                    type="range"
                    min={1}
                    max={3}
                    onChange={setScale}
                    step={0.01}
                    defaultValue={1}
                    className="2xl:w-full xl:w-4/5 md:w-3/5 w-full"
                />
                <div className="flex items-center gap-2">
                    <Button theme="alt" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button theme="default" onClick={saveAvatarImage}>
                        Save
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
