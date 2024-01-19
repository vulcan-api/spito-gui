import { getEnvironmentById } from "@renderer/lib/environments";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { environment } from "@renderer/lib/interfaces";
import toast from "react-hot-toast";
import Loader from "@renderer/Layout/Loader";
import Environment from "../Profile/Components/Environment";
import ManageContentModal from "../Profile/Components/Modals/ManageContentModal";
import { motion } from "framer-motion";

export default function EnvironmentPage(): JSX.Element {
  const [environment, setEnvironment] = useState<environment>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isUserEditingEnvironment, setIsUserEditingEnvironment] = useState<boolean>(false);
  const [editedEnvironmentId, setEditedEnvironmentId] = useState<number>(0);

  const { environmentId = 0 } = useParams<{ environmentId: string }>();
  const navigate = useNavigate();

  async function getEnvironment() {
    setIsFetching(true);
    const res = await getEnvironmentById(+environmentId);
    if (res.status === 200) {
      setEnvironment(res.data);
      setIsFetching(false);
    } else {
      toast.error("Something went wrong");
      navigate("/");
    }
  }

  useEffect(() => {
    getEnvironment();
  }, []);

  function closeEditModal(): void {
    setIsUserEditingEnvironment(false);
    getEnvironment();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8 p-8 items-center justify-center w-full"
    >
      {isUserEditingEnvironment && (
        <ManageContentModal
          isUserEditing={true}
          closeModal={closeEditModal}
          environmentId={editedEnvironmentId}
          isUserEditingEnvironment={true}
        />
      )}
      {isFetching ? (
        <Loader />
      ) : (
        environment && (
          <Environment
            environment={environment}
            setIsUserEditingEnvironment={setIsUserEditingEnvironment}
            setEditedEnvironmentId={setEditedEnvironmentId}
            index={0}
            className="!w-2/3"
            where="page"
          />
        )
      )}
    </motion.div>
  );
}
