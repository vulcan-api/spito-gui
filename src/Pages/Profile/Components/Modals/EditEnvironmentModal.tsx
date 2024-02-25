import { AnimatePresence, motion } from "framer-motion";
import TagInput from "../TagInput";
import { Button } from "@/Components/ui/button";
import { TbArrowLeft, TbArrowRight, TbDeviceFloppy } from "react-icons/tb";
import { Input } from "@/Components/ui/input";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { tagInterface } from "../../../../lib/interfaces";
import {
    getEnvironmentById,
    updateEnvironment,
} from "../../../../lib/environments";
import Loader from "../../../../Layout/Loader";
import { twMerge } from "tailwind-merge";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Textarea } from "@/Components/ui/textarea";

export default function EditEnvironmentModal({
    closeModal,
    environmentId,
}: {
    closeModal: () => void;
    environmentId: number;
}): JSX.Element {
    const [stage, setStage] = useState<number>(1);
    const [enviromentName, setEnviromentName] = useState<string>("");
    const [tags, setTags] = useState<Array<tagInterface>>([]);
    const [description, setDescription] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    async function formSubmitHandler(): Promise<void> {
        if (enviromentName.length < 3) {
            toast.error("Enviroment name must be at least 3 characters long");
            setStage(1);
            return;
        }

        const data = {
            name: enviromentName,
            description: description,
            tags: tags.map((tag) => tag.name),
            isPrivate: isPrivate,
        };

        const toastId = toast.loading("Editing enviroment...");
        const res = await updateEnvironment(environmentId, data);
        if (res) {
            toast.success("Enviroment edited successfully", {
                id: toastId,
            });
            closeModal();
        } else {
            toast.error("Something went wrong", {
                id: toastId,
            });
        }
    }

    async function getEnvironment() {
        setIsFetching(true);
        const res = await getEnvironmentById(environmentId);
        if (res.status === 200) {
            setEnviromentName(res.data.name);
            setDescription(res.data.description || "");
            setTags(res.data.tags);
            setIsPrivate(res.data.isPrivate || false);
            setIsFetching(false);
        } else {
            toast.error("Something went wrong");
            closeModal();
        }
    }

    useEffect(() => {
        getEnvironment();
    }, []);

    return (
        <>
            <div className="flex items-center justify-center my-4">
                <div
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-poppins cursor-pointer"
                    onClick={() => setStage(1)}
                >
                    1
                </div>
                <div
                    className={twMerge(
                        "w-16 transition-colors duration-300 h-1",
                        stage >= 2 ? "bg-primary" : "bg-border"
                    )}
                />
                <div
                    className={twMerge(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 font-poppins cursor-pointer",
                        stage >= 2 ? "bg-primary" : "bg-border"
                    )}
                    onClick={() => setStage(2)}
                >
                    2
                </div>
                <div
                    className={twMerge(
                        "w-16 transition-colors duration-300 h-1",
                        stage === 3 ? "bg-primary" : "bg-border"
                    )}
                />
                <div
                    className={twMerge(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 font-poppins cursor-pointer",
                        stage === 3 ? "bg-primary" : "bg-border"
                    )}
                    onClick={() => setStage(3)}
                >
                    3
                </div>
            </div>
            {isFetching ? (
                <Loader />
            ) : (
                <div className="flex flex-col w-full gap-4 relative">
                    <AnimatePresence mode="wait">
                        {stage === 1 && (
                            <motion.div
                                key="a"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`w-full h-48 flex flex-col justify-end gap-8 p-4`}
                            >
                                <Input
                                    placeholder="Enviroment name"
                                    name="name"
                                    onChange={(e) =>
                                        setEnviromentName(e.target.value)
                                    }
                                    value={enviromentName}
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        defaultChecked={isPrivate}
                                        onCheckedChange={(checked) =>
                                            setIsPrivate(checked)
                                        }
                                        id="isPrivate"
                                    />
                                    <Label
                                        htmlFor="isPrivate"
                                        className="cursor-pointer"
                                    >
                                        Make my environment private
                                    </Label>
                                </div>
                            </motion.div>
                        )}
                        {stage === 2 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="b"
                                className="w-full h-48 flex flex-col gap-4 p-4"
                            >
                                <Textarea
                                    placeholder="Description (optional)"
                                    className="h-44"
                                    maxLength={161}
                                    name="description"
                                    defaultValue={description}
                                    onChange={(e) =>
                                        setDescription(e.currentTarget.value)
                                    }
                                />
                            </motion.div>
                        )}
                        {stage === 3 && (
                            <motion.div
                                className="h-48 flex flex-col p-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="c"
                            >
                                <TagInput
                                    tags={tags}
                                    setTags={setTags}
                                    placeholder="Tags"
                                    name="tags"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex items-center w-full justify-end gap-4 px-4">
                        {stage !== 1 && (
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setStage((prev) => prev - 1)}
                            >
                                <TbArrowLeft />
                                Back
                            </Button>
                        )}
                        {stage !== 3 ? (
                            <Button
                                variant="default"
                                type="button"
                                onClick={() => setStage((prev) => prev + 1)}
                            >
                                Next
                                <TbArrowRight />
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                onClick={formSubmitHandler}
                                type="submit"
                            >
                                Save
                                <TbDeviceFloppy />
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
