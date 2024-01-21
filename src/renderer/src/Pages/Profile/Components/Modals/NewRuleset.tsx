import Button from "@renderer/Layout/Button";
import Input from "@renderer/Layout/Input";
import { useState } from "react";
import TagInput from "../TagInput";
import { tagInterface } from "@renderer/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { createRuleset } from "@renderer/lib/user";
import { TbArrowLeft, TbArrowRight, TbDeviceFloppy } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

export default function NewRuleset({ closeModal }: { closeModal: () => void }): JSX.Element {
  const [stage, setStage] = useState<number>(1);
  const [tags, setTags] = useState<Array<tagInterface>>([]);
  const [address, setAddress] = useState<string>("");
  const [description, setDescription] = useState<string>();

  async function formSubmitHandler(): Promise<void> {
    const urlRegex =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;
    if (!address || !urlRegex.test(address)) {
      toast.error("Invalid repository address");
      setStage(1);
      return;
    }
    const tagNames: string[] = tags.map((tag: tagInterface): string => tag.name);
    const toastId = toast.loading("Creating ruleset...");
    const res = await createRuleset({
      url: address,
      description: description,
      tags: tagNames
    });
    if (res) {
      toast.success("Ruleset created successfully", { id: toastId });
    } else {
      toast.error("An error occured while creating ruleset", { id: toastId });
    }
    closeModal();
  }

  // async function getBranches(): Promise<void> {
  //   window.electron.ipcRenderer.invoke("getBranches", address).then((res) => {
  //     console.log(res);
  //   });
  // }

  return (
    <>
      <div className="flex items-center">
        <div
          className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center font-poppins cursor-pointer"
          onClick={() => setStage(1)}
        >
          1
        </div>
        <div
          className={twMerge(
            "w-16 transition-colors duration-300 h-1",
            stage >= 2 ? "bg-sky-600" : "bg-borderGray"
          )}
        />
        <div
          className={twMerge(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 font-poppins cursor-pointer",
            stage >= 2 ? "bg-sky-600" : "bg-borderGray"
          )}
          onClick={() => setStage(2)}
        >
          2
        </div>
        <div
          className={twMerge(
            "w-16 transition-colors duration-300 h-1",
            stage === 3 ? "bg-sky-600" : "bg-borderGray"
          )}
        />
        <div
          className={twMerge(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 font-poppins cursor-pointer",
            stage === 3 ? "bg-sky-600" : "bg-borderGray"
          )}
          onClick={() => setStage(3)}
        >
          3
        </div>
      </div>
      <form className="flex flex-col w-full gap-4 relative">
        <AnimatePresence mode="wait">
          {stage === 1 && (
            <motion.div
              key="a"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`w-full h-48 flex flex-col p-4`}
            >
              <Input
                placeholder="Ruleset git repository URL address"
                name="address"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
              <span className="my-4 text-center font-poppins text-borderGray">
                Eg. https://github.com/avorty/spito-ruleset
              </span>
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
              <textarea
                placeholder="Description (optional)"
                className={`font-poppins h-44 resize-none block p-2 w-full text-lg text-white bg-transparent rounded-lg border-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors focus:border-sky-500 border-gray-500 placeholder:text-gray-500 duration-300`}
                name="description"
                defaultValue={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
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
              <TagInput tags={tags} setTags={setTags} placeholder="Tags" name="tags" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center w-full gap-4 px-4">
          {stage !== 1 && (
            <Button
              theme="alt"
              className="!w-full text-xl"
              type="button"
              onClick={() => setStage((prev) => prev - 1)}
            >
              <TbArrowLeft />
              Back
            </Button>
          )}
          {stage !== 3 ? (
            <Button
              theme="alt"
              className="!w-full text-xl"
              type="button"
              onClick={() => setStage((prev) => prev + 1)}
            >
              Next
              <TbArrowRight />
            </Button>
          ) : (
            <Button theme="default" onClick={formSubmitHandler} className="!w-full text-xl">
              Create
              <TbDeviceFloppy />
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
