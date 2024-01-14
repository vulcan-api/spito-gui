import { Token } from "@renderer/lib/interfaces";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import TokensTable from "../Components/TokensTable";
import { deleteToken, getUserTokens } from "@renderer/lib/tokens";
import toast from "react-hot-toast";
import { TbPlus } from "react-icons/tb";
import CreateToken from "../Components/Modals/CreateToken";
import DisplayToken from "../Components/Modals/DisplayToken";

export default function Tokens(): JSX.Element {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isCreateTokenModalOpen, setIsCreateTokenModalOpen] = useState<boolean>(false);
  const [isDisplayTokenModalOpen, setIsDisplayTokenModalOpen] = useState<boolean>(false);
  const [newToken, setNewToken] = useState<string>("");

  async function fetchData(): Promise<void> {
    const data = await getUserTokens();
    setTokens(data);
  }

  async function handleDeleteToken(id: number): Promise<void> {
    if (confirm("Are you sure you want to delete this token? This action cannot be undone")) {
      const status = await deleteToken(id);
      if (status == 204) {
        toast.success("Token deleted successfully!");
        await fetchData();
      } else {
        toast.error("Failed to delete token!");
      }
    }
  }

  async function handleCloseCreateModal(tokenParam?: string): Promise<void> {
    if (tokenParam) {
      setNewToken(tokenParam);
      setIsDisplayTokenModalOpen(true);
    }
    setIsCreateTokenModalOpen(false);
    await fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
      key="main"
      className="flex gap-4 p-8"
    >
      <div className="w-fit flex flex-col gap-4">
        <p className="font-roboto text-2xl text-gray-400 text-center">Your tokens</p>
        <p className="font-roboto text-xl text-gray-400 text-center">
          You can use tokens to authenticate yourself in spito CLI.
        </p>
        <p className="font-roboto text-xl text-gray-400 text-center">
          <span className="font-bold">Warning:</span> Tokens are sensitive data. Do not share them
          with anyone!
        </p>
        <p
          className="w-8 h-8 transition-colors duration-300 text-white bg-sky-500 hover:bg-sky-700 -right-10 rounded-full flex items-center justify-center cursor-pointer"
          onClick={() => setIsCreateTokenModalOpen(true)}
        >
          <TbPlus />
        </p>

        <TokensTable tokens={tokens} deleteTokenHandler={handleDeleteToken} />
      </div>
      {isCreateTokenModalOpen && <CreateToken closeModal={handleCloseCreateModal} />}
      {isDisplayTokenModalOpen && (
        <DisplayToken closeModal={() => setIsDisplayTokenModalOpen(false)} token={newToken} />
      )}
    </motion.div>
  );
}
