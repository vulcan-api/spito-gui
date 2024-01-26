import { Token } from "@renderer/lib/interfaces";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import TokensTable from "../Components/TokensTable";
import { deleteToken, getUserTokens } from "@renderer/lib/tokens";
import toast from "react-hot-toast";
import CreateToken from "../Components/Modals/CreateToken";
import DisplayToken from "../Components/Modals/DisplayToken";
import Button from "@renderer/Layout/Button";
import Loader from "@renderer/Layout/Loader";

export default function Tokens(): JSX.Element {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isCreateTokenModalOpen, setIsCreateTokenModalOpen] = useState<boolean>(false);
  const [isDisplayTokenModalOpen, setIsDisplayTokenModalOpen] = useState<boolean>(false);
  const [newToken, setNewToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchData(): Promise<void> {
    setIsLoading(true);
    const data = await getUserTokens();
    setTokens(data);
    setIsLoading(false);
  }

  async function handleDeleteToken(id: number): Promise<void> {
    if (confirm("Are you sure you want to delete this token? This action cannot be undone!")) {
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

  function displayTokenModalCloseHandler() {
    if (
      confirm(
        "Are you sure you want to close this modal? You won't be able to see this token again!"
      )
    ) {
      setIsDisplayTokenModalOpen(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
      key="tokens"
      className="flex flex-col justify-center items-center gap-4 flex-1"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-fit flex flex-col gap-4">
            <p className="font-roboto text-2xl text-gray-400 text-center">Your tokens</p>
            <p className="font-roboto text-xl text-gray-400 text-center">
              You can use tokens to authenticate yourself in spito CLI.
            </p>
            <p className="font-roboto text-xl text-gray-400 text-center">
              <span className="text-red-400">Warning:</span> Tokens are sensitive data. Do not share
              them with anyone!
            </p>
            {tokens.length > 0 ? (
              <TokensTable tokens={tokens} deleteTokenHandler={handleDeleteToken} />
            ) : (
              <p className="text-2xl text-gray-500 text-center font-roboto mt-8">No tokens!</p>
            )}
          </div>
          {isCreateTokenModalOpen && <CreateToken closeModal={handleCloseCreateModal} />}
          {isDisplayTokenModalOpen && (
            <DisplayToken closeModal={displayTokenModalCloseHandler} token={newToken} />
          )}
          <Button
            theme="alt"
            onClick={() => setIsCreateTokenModalOpen(true)}
            className="!w-fit mx-auto mt-10"
          >
            Create new token
          </Button>
        </>
      )}
    </motion.div>
  );
}
