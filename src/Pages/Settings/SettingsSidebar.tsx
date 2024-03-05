import AvatarComponent from "../../Components/AvatarComponent";
import { UserInfo, currentPageType } from "../../lib/interfaces";
import { Dispatch, SetStateAction } from "react";
import { Tb2Fa, TbBodyScan, TbPasswordUser, TbUser } from "react-icons/tb";

const SettingsSidebar = ({
    page,
    setPage,
    loggedUserData,
}: {
    page: currentPageType;
    setPage: Dispatch<SetStateAction<currentPageType>>;
    loggedUserData: UserInfo;
}): JSX.Element => {
    function tabClasses(tab: currentPageType): string {
        return `text-2xl h-full font-poppins flex items-center justify-center transition-colors duration-300 gap-2 w-full rounded-lg px-2 py-1 cursor-pointer ${
            page === tab
                ? "bg-foreground/10 text-primary"
                : "bg-transparent text-muted-foreground hover:bg-foreground/10"
        }`;
    }

    return (
        <div className="flex flex-col gap-4 h-full p-4 !w-1/6 shadow-darkMain">
            <p className="aspect-square flex flex-col items-center gap-2">
                <AvatarComponent
                    size="medium"
                    userId={loggedUserData.id}
                    username={loggedUserData.username}
                    className="shadow-darkMain"
                />
                <span className="text-center font-poppins text-xl text-gray-400">
                    {loggedUserData.username}
                </span>
            </p>
            <p onClick={() => setPage("about")} className={tabClasses("about")}>
                <TbUser /> <span>About</span>
            </p>
            <p
                onClick={() => setPage("tokens")}
                className={tabClasses("tokens")}
            >
                <TbBodyScan /> <span>Tokens</span>
            </p>
            <p onClick={() => setPage("2fa")} className={tabClasses("2fa")}>
                <Tb2Fa /> <span>2FA</span>
            </p>
            <p
                onClick={() => setPage("changePassword")}
                className={tabClasses("changePassword")}
            >
                <TbPasswordUser /> <span>Change Password</span>
            </p>
        </div>
    );
};

export default SettingsSidebar;
