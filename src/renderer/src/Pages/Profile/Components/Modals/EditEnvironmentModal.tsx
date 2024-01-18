import { AnimatePresence, motion } from "framer-motion";
import TagInput from "../TagInput";
import Button from "@renderer/Layout/Button";
import { TbArrowLeft, TbArrowRight, TbDeviceFloppy } from "react-icons/tb";
import Checkbox from "@renderer/Layout/Checkbox";
import Input from "@renderer/Layout/Input";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { tagInterface } from "@renderer/lib/interfaces";
import { getEnvironmentById, updateEnvironment } from "@renderer/lib/environments";
import Loader from "@renderer/Layout/Loader";

export default function EditEnvironmentModal({
  closeModal,
  environmentId
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
      isPrivate: isPrivate
    };

    const toastId = toast.loading("Editing enviroment...");
    const res = await updateEnvironment(environmentId, data);
    if (res) {
      toast.success("Enviroment created successfully", {
        id: toastId
      });
      closeModal();
    } else {
      toast.error("Something went wrong", {
        id: toastId
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
      //   setIsPrivate(res.data.isPrivate);
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
      <div className="flex items-center">
        <div
          className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center font-poppins cursor-pointer"
          onClick={() => setStage(1)}
        >
          1
        </div>
        <div
          className={`w-16 ${
            stage >= 2 ? "bg-sky-600" : "bg-borderGray"
          } transition-colors duration-300 h-1`}
        />
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 font-poppins cursor-pointer ${
            stage >= 2 ? "bg-sky-600" : "bg-borderGray"
          }`}
          onClick={() => setStage(2)}
        >
          2
        </div>
        <div
          className={`w-16 ${
            stage === 3 ? "bg-sky-600" : "bg-borderGray"
          } transition-colors duration-300 h-1`}
        />
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 font-poppins cursor-pointer ${
            stage === 3 ? "bg-sky-600" : "bg-borderGray"
          }`}
          onClick={() => setStage(3)}
        >
          3
        </div>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <form className="flex flex-col w-full gap-4 relative">
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
                  onChange={(e) => setEnviromentName(e.target.value)}
                  value={enviromentName}
                />
                <Checkbox
                  id="publicity"
                  label="Make my enviroment private"
                  checked={isPrivate}
                  onChange={() => setIsPrivate((prev) => !prev)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                Save
                <TbDeviceFloppy />
              </Button>
            )}
          </div>
        </form>
      )}
    </>
  );
}
