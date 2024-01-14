import Button from "@renderer/Layout/Button";
import Input from "@renderer/Layout/Input";
import { createToken } from "@renderer/lib/tokens";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";

export default function CreateToken({
  closeModal
}: {
  closeModal: (token?: string) => void;
}): JSX.Element {
  const nameRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const expiresAtRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  async function formSubmitHandler(): Promise<void> {
    const name = nameRef.current?.value as string;
    const expiresAt = new Date(expiresAtRef.current?.value as string);
    const data = await createToken(name, expiresAt);
    closeModal(data.token);
  }
  return (
    <AnimatePresence>
      <div className="flex items-center justify-center absolute left-0 top-0 w-screen h-screen z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute w-screen h-screen backdrop-blur-sm supports-backdrop-blur:bg-black/60"
          onClick={() => closeModal()}
        />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="2xl:w-1/4 xl:w-1/3 md:w-1/2 w-full md:h-fit h-full bg-bgColor md:border-2 md:rounded-xl md:border-bgLight text-gray-100 shadow-darkMain relative p-4 pt-16 pb-8 flex flex-col items-center gap-8"
        >
          <TbX
            onClick={() => closeModal()}
            className="absolute right-4 top-4 text-3xl cursor-pointer hover:text-sky-500 transition-colors"
          />

          <form className="flex flex-col w-full gap-4 relative">
            <AnimatePresence mode="wait">
              <Input placeholder="Name" name="name" type="text" ref={nameRef} />
              <Input placeholder="Expires at" name="expiresAt" type="date" ref={expiresAtRef} />
            </AnimatePresence>

            <Button theme="default" onClick={formSubmitHandler} className="!w-full text-xl">
              Create
              <TbDeviceFloppy />
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
