import { forwardRef, useState } from "react";
import { InputProps } from "../lib/interfaces";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

export default forwardRef(function Input(
  {
    id,
    type,
    placeholder,
    className,
    containerClassName,
    value,
    onKeyDown,
    onChange,
    disabled,
    readonly,
    name,
    max
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
): JSX.Element {
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);

  function changeVisibility(): void {
    setIsPasswordHidden((prev: boolean) => !prev);
  }

  return (
    <div className={twMerge("relative", containerClassName)}>
      <input
        type={!isPasswordHidden ? "text" : type || "text"}
        className={twMerge(
          "font-poppins block pl-2.5 pb-2.5 pt-4 pr-4 w-full text-lg text-gray-100 bg-transparent rounded-lg border-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors focus:border-sky-500 border-bgLighter",
          className
        )}
        defaultValue={value || ""}
        onChange={onChange}
        readOnly={readonly}
        name={name}
        id={id || placeholder}
        placeholder=" "
        disabled={disabled}
        ref={ref || null}
        maxLength={max}
        onKeyDown={onKeyDown}
      />
      <label
        htmlFor={id || placeholder}
        className="absolute font-poppins text-lg cursor-text duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-bgColor px-2 peer-focus:px-2 text-gray-500 peer-focus:text-sky-600 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {placeholder}
      </label>
      {type === "password" &&
        (isPasswordHidden ? (
          <BsEyeSlashFill
            className="text-2xl cursor-pointer absolute text-white right-2 top-4"
            onClick={changeVisibility}
          />
        ) : (
          <BsEyeFill
            className="text-2xl cursor-pointer absolute text-white right-2 top-4"
            onClick={changeVisibility}
          />
        ))}
    </div>
  );
});
