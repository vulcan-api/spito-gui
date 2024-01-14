import { Dispatch, SetStateAction } from "react";
import { TbBodyScan, TbSettingsFilled } from "react-icons/tb";

type currentPageType = "main" | "tokens";
const SettingsSidebar = ({
  page,
  setPage
}: {
  page: currentPageType;
  setPage: Dispatch<SetStateAction<currentPageType>>;
}): JSX.Element => {
  function tabClasses(tab: currentPageType): string {
    return `text-2xl font-roboto flex items-center transition-colors duration-300 gap-2 w-full rounded-lg px-2 py-1 cursor-pointer ${
      page === tab ? "bg-bgLight text-sky-400" : "bg-transparent text-gray-400 hover:bg-bgLight"
    }`;
  }

  return (
    <div className="flex flex-col gap-4 h-full p-4 border-r-[1px] border-bgLight w-1/6">
      <p onClick={() => setPage("main")} className={tabClasses("main")}>
        <TbSettingsFilled /> <span>Main</span>
      </p>
      <p onClick={() => setPage("tokens")} className={tabClasses("tokens")}>
        <TbBodyScan /> <span>Tokens</span>
      </p>
    </div>
  );
};

export default SettingsSidebar;
