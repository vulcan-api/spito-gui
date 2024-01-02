import Button from "@renderer/Layout/Button";
import Input from "@renderer/Layout/Input";
import { useRef, useState } from "react";
import TagInput from "../TagInput";
import { tagInterface } from "@renderer/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { createRuleset } from "@renderer/lib/user";

export default function NewRuleset({ closeModal }: { closeModal: () => void }): JSX.Element {
  const [stage, setStage] = useState<number>(1);
  const [tags, setTags] = useState<Array<tagInterface>>([]);
  const [address, setAddress] = useState<string>("");
  const [branch, setBranch] = useState<string>("main");
  const desciriptionRef = useRef<HTMLTextAreaElement>(null);

  async function formSubmitHandler(): Promise<void> {
    const urlRegex =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;
    if (!address || !urlRegex.test(address)) {
      toast.error("Invalid repository address");
      setStage(1);
      return;
    }
    const tagNames: string[] = [];
    tags.forEach((t: tagInterface): void => {
      tagNames.push(t.name);
    });
    const toastId = toast.loading("Creating ruleset...");
    const res = await createRuleset({
      url: address,
      branch,
      description: desciriptionRef.current?.value,
      tags: tagNames
    });
    if (res) {
      toast.success("Ruleset created successfully", { id: toastId });
    } else {
      toast.error("An error occured while creating ruleset", { id: toastId });
    }
    closeModal();
  }

  /* 
    {
        "id": 1,
        "name": "avorty/spito-ruleset",
        "description": null,
        "url": "https://github.com/avorty/spito-ruleset",
        "createdAt": "2023-12-29T10:18:51.289Z",
        "updatedAt": "2023-12-29T10:18:51.289Z",
        "user": {
            "id": 1,
            "username": "jajco"
        },
        "tags": [
            {
                "id": 1,
                "name": "spito"
            },
            {
                "id": 2,
                "name": "spito-ruleset"
            },
            {
                "id": 3,
                "name": "popular"
            }
        ]
    }
  */

  return (
    <>
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center font-poppins">
          1
        </div>
        <div
          className={`w-16 ${
            stage >= 2 ? "bg-sky-600" : "bg-borderGray"
          } transition-colors duration-300 h-1`}
        />
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 font-poppins ${
            stage >= 2 ? "bg-sky-600" : "bg-borderGray"
          }`}
        >
          2
        </div>
        <div
          className={`w-16 ${
            stage === 3 ? "bg-sky-600" : "bg-borderGray"
          } transition-colors duration-300 h-1`}
        />
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 font-poppins ${
            stage === 3 ? "bg-sky-600" : "bg-borderGray"
          }`}
        >
          3
        </div>
      </div>
      <form className="flex flex-col w-full gap-4 overflow-x-hidden relative">
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
                placeholder="Ruleset github repository address"
                name="address"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
              <span className="my-4 text-center font-poppins text-borderGray">
                Eg. https://github.com/avorty/spito-ruleset
              </span>
              <Input
                placeholder="Branch"
                name="branch"
                onChange={(e) => setBranch(e.target.value)}
                value={branch}
              />
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
                ref={desciriptionRef}
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
            </Button>
          ) : (
            <Button theme="default" onClick={formSubmitHandler} className="!w-full text-xl">
              Create
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
