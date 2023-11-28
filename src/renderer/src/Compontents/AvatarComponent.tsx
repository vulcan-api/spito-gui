import { BACKEND_ORIGIN } from "@renderer/lib/constants";
import { getUserAvatar } from "@renderer/lib/user";
import { useState, useCallback, useEffect } from "react";
import Avatar from "react-avatar";
import { ColorRing } from "react-loader-spinner";

export default function AvatarComponent(props: {
  userId: number;
  className?: string;
  username: string;
  size: "small" | "big";
}): JSX.Element {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [avatarSize, setAvatarSize] = useState<number>(64);

  const getAvatarUrl = useCallback(async (): Promise<void> => {
    const avatar = await getUserAvatar(props.userId);
    const url = URL.createObjectURL(avatar);
    setAvatarUrl(url);
    setIsLoading(false);
  }, [props.userId]);

  function calculateAvatarSize(): void {
    if (props.size === "small") {
      setAvatarSize(32);
    } else {
      setAvatarSize(192);
    }
  }

  useEffect(() => {
    getAvatarUrl();
    calculateAvatarSize();
  }, [getAvatarUrl, calculateAvatarSize]);

  return (
    <>
      {isLoading ? (
        <ColorRing
          visible={true}
          width={avatarSize}
          height={avatarSize}
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#a7f3d0", "#2dd4bf", "#ADB5BD", "#F8F9FA", "#10b981"]}
        />
      ) : avatarUrl ? (
        <img
          className={props.className}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: "100%"
          }}
          src={avatarUrl}
          alt="User's avatar"
        />
      ) : (
        <Avatar name={props.username} size={String(avatarSize)} round={true} />
      )}
    </>
  );
}
