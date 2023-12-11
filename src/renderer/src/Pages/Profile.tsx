import AvatarComponent from "@renderer/Compontents/AvatarComponent";
import { ProfileInterface } from "@renderer/lib/interfaces";
import { getUserProfile, updateSettings } from "@renderer/lib/user";
import { motion, useIsPresent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { TbSettingsFilled } from "react-icons/tb/";
import Input from "@renderer/Layout/Input";
import Button from "@renderer/Layout/Button";
import toast from "react-hot-toast";

export default function Profile(): JSX.Element {
  const { userId } = useParams<{ userId: string }>();
  const isPresent = useIsPresent();
  const [userData, setUserData] = useState<ProfileInterface>();
  const [site, setSite] = useState<"main" | "rules" | "rulesets" | "configs">("main");
  const [isUserChangingSettings, setIsUserChangingSettings] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  async function fetchData(): Promise<void> {
    const data = await getUserProfile(Number(userId));
    if (data.username) {
      setUserData(data);
    }
  }

  const menuLinkClass = (isActive: boolean): string => {
    return `roboto transition-all text-center px-8 py-2 uppercase w-full hover:bg-bgLight ${
      isActive ? "bg-bgLight text-gray-200" : "bg-bgClr text-gray-400"
    }`;
  };

  function handleReactingWithSettings(): void {
    if (!isUserChangingSettings) {
      setIsUserChangingSettings(!isUserChangingSettings);
    } else {
      if (confirm("Do you want to close settings? Unsaved changes will be lost.")) {
        setIsUserChangingSettings(false);
      }
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
      if (description === userData?.description && username === userData?.username) return;
      const toastId = toast.loading("Updating...");
      const status = await updateSettings({ username, description });
      if (status) {
        toast.success("Settings saved!", {
          id: toastId
        });
        setIsUserChangingSettings(false);
      } else {
        toast.error("Failed to save settings!", {
          id: toastId
        });
      }
    }
  }

  useEffect(() => {
    fetchData();
    const site: string = window.location.pathname.split("/").pop() || "";
    if (isNaN(+site)) {
      setSite(site as "main" | "rules" | "rulesets" | "configs");
    } else {
      setSite("main");
    }
  }, []);

  return (
    <div className="flex-1 w-4/5 mx-auto flex flex-col px-16 overflow-y-auto my-4">
      <div className="w-full pb-8 flex gap-8 py-8">
        <div className="h-fit w-fit flex flex-col gap-4 bg-bgLightTransparent border-2 border-bgLight rounded-xl shadow-main px-8 py-8 duration-300 relative">
          <TbSettingsFilled
            onClick={handleReactingWithSettings}
            className="absolute right-4 top-4 text-2xl text-gray-400 transition-all hover:text-emerald-500 hover:rotate-45 cursor-pointer"
          />
          <AvatarComponent username={userData?.username || ""} size="big" userId={Number(userId)} />
          <div className="flex flex-col gap-4 w-full">
            {isUserChangingSettings ? (
              <>
                <Input placeholder="Username" value={userData?.username} ref={usernameRef} />
                <textarea
                  placeholder="Description"
                  defaultValue={userData?.description}
                  className="roboto max-h-72 block p-2 w-full text-lg text-white bg-transparent rounded-lg border-2  appearance-none focus:outline-none focus:ring-0 peer transition-colors placeholder-shown:border-gray-500 focus:border-emerald-500 border-emerald-500"
                  ref={descriptionRef}
                />
                <Button theme="default" className="!w-full" onClick={handleSaveSettings}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-gray-100 text-4xl roboto">{userData?.username}</h1>
                <p className="text-gray-400 text-lg roboto line-clamp-4">
                  {userData?.description || "This user has no description yet!"}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 gap-8 h-fit bg-bgLightTransparent rounded-xl shadow-main border-2 border-bgLight duration-300 text-2xl text-gray-100 roboto capitalize">
          <div className="flex items-center border-b-2 justify-between border-bgLight">
            <NavLink
              to={`/profile/${userId}`}
              end
              className={({ isActive }) => menuLinkClass(isActive)}
            >
              {userData?.username}
            </NavLink>
            <NavLink
              to={`/profile/${userId}/rules`}
              className={({ isActive }) => menuLinkClass(isActive)}
            >
              Rules
            </NavLink>
            <NavLink
              to={`/profile/${userId}/rulesets`}
              className={({ isActive }) => menuLinkClass(isActive)}
            >
              Rulesets
            </NavLink>
            <NavLink
              to={`/profile/${userId}/configs`}
              className={({ isActive }) => menuLinkClass(isActive)}
            >
              Configs
            </NavLink>
          </div>
          <div className="flex flex-col gap-8 p-4 text-gray-400">
            <p>{site}</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi deleniti, adipisci
              magnam distinctio obcaecati enim voluptatum eaque et vitae architecto.
            </p>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.6, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen z-50"
      />
    </div>
  );
}
