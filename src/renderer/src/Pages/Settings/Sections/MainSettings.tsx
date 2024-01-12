import Button from "@renderer/Layout/Button";
import Input from "@renderer/Layout/Input";
import { userAtom } from "@renderer/lib/atoms";
import { ProfileInterface } from "@renderer/lib/interfaces";
import { getUserProfile, updateSettings } from "@renderer/lib/user";
import { useAtomValue } from "jotai";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export default function MainSettings(): JSX.Element {
  const user = useAtomValue(userAtom);

  const [userData, setUserData] = useState<ProfileInterface>();
  const usernameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  async function fetchData(): Promise<void> {
    const data = await getUserProfile(user.id);
    if (data.username) {
      setUserData(data);
    }
  }

  async function handleSaveSettings(): Promise<void> {
    if (usernameRef.current && descriptionRef.current) {
      const username = usernameRef.current.value;
      const description = descriptionRef.current.value;
      if (username === "") {
        toast.error("Username can't be empty!");
        return;
      }
      if (description === userData?.description && username === userData?.username) {
        return;
      }
      const toastId = toast.loading("Updating...");
      const isSettingsStatusOk = await updateSettings({
        username,
        description
      });

      if (isSettingsStatusOk) {
        toast.success("Settings saved!", {
          id: toastId
        });
        fetchData();
      } else {
        toast.error("Failed to save settings!", {
          id: toastId
        });
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-[20vw] items-center justify-center">
      <Input placeholder="Username" value={userData?.username} ref={usernameRef} max={16} />
      <textarea
        placeholder="Description"
        defaultValue={userData?.description}
        className="font-poppins max-h-72 block p-2 w-full text-lg duration-300 text-white bg-transparent rounded-lg border-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors focus:border-sky-500 border-gray-500"
        ref={descriptionRef}
      />
      <Button theme="default" className="!w-full" onClick={handleSaveSettings}>
        Save
      </Button>
    </div>
  );
}
