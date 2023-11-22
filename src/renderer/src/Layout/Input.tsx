import { forwardRef, useState } from 'react'
import { InputProps } from '../../lib/Interfaces'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'

export default forwardRef(function Input(
  {
    id,
    type,
    placeholder,
    className,
    containerClassName,
    value,
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
    <div className={`relative ${containerClassName}`}>
      <input
        type={!isPasswordHidden ? 'text' : type || 'text'}
        className={`${className} roboto block pl-2.5 pb-2.5 pt-4 pr-12 w-full text-lg text-white bg-transparent rounded-lg border-2  appearance-none focus:outline-none focus:ring-0 peer transition-colors placeholder-shown:border-gray-500 focus:border-teal-500 border-teal-500`}
        defaultValue={value || ''}
        onChange={onChange}
        readOnly={readonly}
        name={name}
        id={id || placeholder}
        placeholder=" "
        disabled={disabled}
        ref={ref || null}
        maxLength={max}
      />
      <label
        htmlFor={id || placeholder}
        className="absolute roboto text-lg cursor-text duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-bgColor px-2 peer-focus:px-2 text-teal-600 peer-focus:text-teal-600 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {placeholder}
      </label>
      {type === 'password' &&
        (isPasswordHidden ? (
          <BsEyeSlashFill
            className="text-2xl cursor-pointer absolute right-2 top-4"
            onClick={changeVisibility}
          />
        ) : (
          <BsEyeFill
            className="text-2xl cursor-pointer absolute right-2 top-4"
            onClick={changeVisibility}
          />
        ))}
    </div>
  )
})
