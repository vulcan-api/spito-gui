import { getUserAvatar } from "../lib/user";
import { useState, useCallback, useEffect } from "react";
import Avatar from "react-avatar";
import { ColorRing } from "react-loader-spinner";

export default function AvatarComponent(props: {
    userId: number;
    className?: string;
    username: string;
    size: "small" | "medium" | "big";
}): JSX.Element {
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const avatarSize =
        props.size === "small" ? 32 : props.size === "medium" ? 176 : 288;

    const getAvatarUrl = useCallback(async (): Promise<void> => {
        const avatar = await getUserAvatar(props.userId);
        if (avatar) {
            const url = URL.createObjectURL(avatar);
            setAvatarUrl(url);
        }
        setIsLoading(false);
    }, [props.userId]);

    useEffect(() => {
        getAvatarUrl();
    }, [getAvatarUrl]);

    return (
        <>
            {isLoading ? (
                <ColorRing
                    visible={true}
                    width={avatarSize}
                    height={avatarSize}
                    ariaLabel="blocks-loading"
                    wrapperClass="rounded-full"
                    colors={[
                        "#67e8f9",
                        "#0ea5e9",
                        "#1d4ed8",
                        "#F8F9FA",
                        "#a5b4fc",
                    ]}
                />
            ) : avatarUrl ? (
                <img
                    className={props.className}
                    style={{
                        width: avatarSize,
                        height: avatarSize,
                        borderRadius: "100%",
                    }}
                    src={avatarUrl}
                    alt="User's avatar"
                />
            ) : (
                <Avatar
                    name={props.username}
                    size={String(avatarSize)}
                    round={true}
                    className={props.className}
                />
            )}
        </>
    );
}
