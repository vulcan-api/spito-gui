import { forwardRef } from "react";

interface checkboxProps {
    label: string;
    checked?: boolean;
    name?: string;
    id: string;
    onChange?: () => void;
}

export default forwardRef(function Checkbox(
    { label, checked, name, id, onChange }: checkboxProps,
    ref: React.ForwardedRef<HTMLInputElement>
): JSX.Element {
    return (
        <span className="flex items-center gap-4">
            <input
                className="appearance-none w-10 rounded-full h-4 shadow-darkMain bg-bgLight cursor-pointer relative after:content-[''] after:absolute after:bg-borderGray checked:after:bg-sky-500 after:rounded-full after:w-6 after:-top-1 after:h-6 checked:after:translate-x-6 after:transition-all after:duration-300"
                type="checkbox"
                name={name}
                checked={checked}
                id={id}
                ref={ref}
                onChange={onChange}
            />
            <label
                htmlFor={id}
                className="text-xl font-poppins text-gray-400 cursor-pointer"
            >
                {label}
            </label>
        </span>
    );
});
