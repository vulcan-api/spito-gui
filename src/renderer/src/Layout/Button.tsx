import { Link } from 'react-router-dom'
import { ButtonProps } from 'src/renderer/lib/Interfaces'

export default function Button({
  onClick,
  className,
  children,
  theme,
  isLink,
  to,
  disabled,
  width
}: ButtonProps): JSX.Element {
  const link = (
    <Link
      to={to || '/'}
      className={`${
        theme === 'alt'
          ? 'border-teal-500 text-teal-500'
          : 'bg-teal-600 text-gray-200 border-teal-700'
      } active:scale-90 transition-all p-2 flex items-center rounded-lg justify-center gap-2 box-border border-2 text-2xl roboto ${className} ${
        width || 'sm:w-48 w-32'
      }`}
    >
      {children}
    </Link>
  )

  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${
        theme === 'alt'
          ? 'border-teal-500 text-teal-500'
          : 'bg-teal-600 text-gray-200 border-teal-700'
      } flex gap-2 items-center active:scale-90 border-2 roboto text-2xl rounded-lg p-2 transition-all justify-center box-border ${className}  ${
        width || 'sm:w-48 w-32'
      } ${disabled && '!bg-gray-500 !border-gray-500'}`}
      type={'button'}
    >
      {children}
    </button>
  )

  return isLink ? link : button
}
