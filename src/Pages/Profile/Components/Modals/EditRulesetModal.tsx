import { Input } from "@/Components/ui/input";
import { tagInterface } from "../../../../lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import TagInput from "../TagInput";
import { TbArrowLeft, TbArrowRight, TbDeviceFloppy } from "react-icons/tb";
import { Button } from "@/Components/ui/button";
import { getRulesetById, updateRuleset } from "../../../../lib/user";
import Loader from "../../../../Layout/Loader";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import isUrl from "is-url-superb";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

export default function EditRulesetModal({
    closeModal,
    rulesetId,
}: {
    closeModal: () => void;
    rulesetId: number;
}): JSX.Element {
    const [stage, setStage] = useState<number>(1);
    const [tags, setTags] = useState<Array<tagInterface>>([]);
    const [address, setAddress] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isFetching, setIsFetching] = useState<boolean>(false);

    async function getRuleset(): Promise<void> {
        setIsFetching(true);
        const response = await getRulesetById(rulesetId);
        if (response) {
            setAddress(response.url);
            setDescription(response.description || "");
            setTags(response.tags);
        } else {
            alert("Error fetching ruleset");
            closeModal();
        }
        setIsFetching(false);
    }

    useEffect(() => {
        getRuleset();
    }, [rulesetId]);

    async function formSubmitHandler(): Promise<void> {
        const isAddressValidUrl = isUrl(address);
        if (!address || !isAddressValidUrl) {
            toast.error("Invalid repository address");
            setStage(1);
            return;
        }
        const tagNames: string[] = [];
        tags.forEach((t: tagInterface): void => {
            tagNames.push(t.name);
        });
        const toastId = toast.loading("Updating ruleset...");
        const res = await updateRuleset(
            {
                url: address,
                description,
                tags: tagNames,
            },
            rulesetId
        );
        if (res) {
            toast.success("Ruleset updated successfully", { id: toastId });
        } else {
            toast.error("An error occured while updating ruleset", {
                id: toastId,
            });
        }
        closeModal();
    }

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
                                className={`w-full h-48 flex flex-col p-4 justify-center`}
                            >
                                <Input
                                    placeholder="Ruleset git repository URL address"
                                    name="address"
                                    onChange={(e) => setAddress(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setStage((prev) => prev + 1);
                                        }
                                    }}
                                    defaultValue={address}
                                />
                                <Label className="my-4 text-muted-foreground">
                                    Eg. https://github.com/avorty/spito-ruleset
                                </Label>
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
