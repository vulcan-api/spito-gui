interface InputProps {
  id?: string;
  type?: string;
  placeholder: string;
  className?: string;
  containerClassName?: string;
  max?: number;
  name?: string;
  disabled?: boolean;
  value?: string;
  readonly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ButtonProps {
  onClick?: () => void;
  theme: "default" | "alt";
  isLink?: boolean;
  to?: string;
  className?: string;
  children: React.ReactNode;
  submit?: boolean;
  disabled?: boolean;
  width?: string;
}

interface UserInfo {
  id: number;
  username: string;
}

interface Settings {
  username: string;
  email: string;
}

interface Profile {
  id: number;
  username: string;
}

export type { InputProps, ButtonProps, Profile, UserInfo, Settings };
