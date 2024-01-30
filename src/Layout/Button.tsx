import { Link } from "react-router-dom";
import { ButtonProps } from "../lib/interfaces";
import { twMerge } from "tailwind-merge";

export default function Button({
    onClick,
    className,
    children,
    theme,
    isLink,
    to,
    disabled,
    width,
    type,
}: ButtonProps): JSX.Element {
    const link = (
        <Link
            to={to || "/"}
            className={twMerge(
                `${
                    theme === "alt"
                        ? "border-bgLight hover:border-bgLighter bg-bgLight text-gray-300 hover:text-gray-400"
                        : "border-bgLighter text-gray-400 hover:border-sky-500 hover:text-sky-400"
                } active:scale-90 transition-all p-2 flex items-center rounded-lg justify-center shadow-darkMain gap-2 box-border border-2 text-2xl font-roboto ${className} ${
                    width || "sm:w-48 w-32"
                }`,
                disabled && "!bg-gray-500 !border-gray-500"
            )}
        >
            {children}
        </Link>
    );

    const button = (
        <button
            onClick={onClick}
            disabled={disabled}
            type={type || "button"}
            className={twMerge(
                `${
                    theme === "alt"
                        ? "border-bgLight hover:border-bgLighter bg-bgLight text-gray-300 hover:text-gray-400"
                        : "border-bgLighter text-gray-400 hover:border-sky-500 hover:text-sky-400"
                } active:scale-90 transition-all p-2 flex items-center rounded-lg justify-center shadow-darkMain gap-2 box-border border-2 text-2xl font-roboto ${className} ${
                    width || "sm:w-48 w-32"
                }`,
                disabled && "!bg-gray-500 !border-gray-500"
            )}
        >
            {children}
        </button>
    );

    return isLink ? link : button;
}
