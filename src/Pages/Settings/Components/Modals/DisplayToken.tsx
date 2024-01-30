import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { TbCopy, TbX } from "react-icons/tb";

export default function DisplayToken({
  closeModal,
  token
}: {
  closeModal: () => void;
  token: string;
}): JSX.Element {
  function copyTokenToClipoard(): void {
    navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard!");
  }

  return (
    <AnimatePresence>
      <div className="flex items-center justify-center absolute left-0 top-0 w-screen h-screen z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute w-screen h-screen backdrop-blur-sm supports-backdrop-blur:bg-black/60"
          onClick={closeModal}
          key="backdrop"
        />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="2xl:w-1/2 xl:w-1/3 w-full md:h-fit h-full bg-bgColor md:border-2 md:rounded-xl md:border-bgLight text-gray-100 shadow-darkMain relative p-4 pt-16 pb-8 flex flex-col items-center gap-8"
          key="modal"
        >
          <TbX
            onClick={closeModal}
            className="absolute right-4 top-4 text-3xl cursor-pointer hover:text-sky-500 transition-colors"
          />
          <p className="font-roboto text-xl text-gray-400 text-center">Your token is:</p>
          <p className="font-roboto text-xl text-gray-400 text-center flex items-center gap-4">
            {token}{" "}
            <TbCopy
              onClick={copyTokenToClipoard}
              className="cursor-pointer rounded-md transition-colors hover:bg-borderGray"
            />
          </p>
          <p className="font-roboto text-xl text-gray-400 text-center">
            Copy and save it somewhere safe. You will not be able to see it again!
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
