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
  type
}: ButtonProps): JSX.Element {
  const link = (
    <Link
      to={to || "/"}
      className={twMerge(
        `${
          theme === "alt"
            ? "hover:border-sky-500 border-bgLight hover:text-sky-500 text-gray-200"
            : "hover:bg-sky-600 bg-bgLight text-gray-200 hover:border-sky-700"
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
            ? "hover:border-sky-500 border-bgLight hover:text-sky-500 text-gray-200"
            : "hover:bg-sky-600 bg-bgLight text-gray-200 hover:border-sky-700"
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
