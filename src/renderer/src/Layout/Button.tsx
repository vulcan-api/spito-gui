import { Link } from "react-router-dom";
import { ButtonProps } from "../lib/interfaces";

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
      className={`${
        theme === "alt"
          ? "hover:border-sky-500 border-bgLight hover:text-sky-500 text-gray-200"
          : "hover:bg-sky-600 bg-bgLight text-gray-200 hover:border-sky-700"
      } active:scale-90 transition-all p-2 flex items-center rounded-lg justify-center shadow-darkMain gap-2 box-border border-2 text-2xl font-roboto ${className} ${
        width || "sm:w-48 w-32"
      }`}
    >
      {children}
    </Link>
  );

  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type || "button"}
      className={`${
        theme === "alt"
          ? "border-bgLight hover:border-bgLighter bg-bgLight text-gray-300 hover:text-gray-400"
          : "border-bgLighter text-gray-400 hover:border-sky-500 hover:text-sky-400"
      } flex gap-2 items-center active:scale-90 border-2 font-roboto text-2xl rounded-lg p-2 shadow-darkMain transition-all duration-300 justify-center box-border ${className}  ${
        width || "sm:w-48 w-32"
      } ${disabled && "!bg-gray-500 !border-gray-500"}`}
    >
      {children}
    </button>
  );

  return isLink ? link : button;
}
