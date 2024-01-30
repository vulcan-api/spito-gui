import { twMerge } from "tailwind-merge";

interface Props {
    size: number;
    username: string;
    isRounded?: boolean;
    className?: string;
}

export default function DefaultAvatar({
    size,
    username,
    className,
    isRounded = true,
}: Props): JSX.Element {
    return (
        <div
            className={twMerge(
                "bg-gray-600 flex justify-center items-center",
                className,
                isRounded ? "rounded-full" : ""
            )}
            style={{ width: size, height: size }}
        >
            <p className="text-white" style={{ fontSize: size / 2 }}>
                {username && username[0].toUpperCase()}
            </p>
        </div>
    );
}
