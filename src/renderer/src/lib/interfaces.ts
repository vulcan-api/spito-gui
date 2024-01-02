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
  type?: "button" | "submit" | "reset";
}

interface UserInfo {
  id: number;
  username: string;
}

interface Settings {
  username: string;
  description?: string;
}

interface ProfileInterface {
  id: number;
  username: string;
  description?: string;
}

interface tagInterface {
  id: number;
  name: string;
  usageCount? : number;
}

interface newRuleset {
  description?: string;
  url: string;
  branch: string;
  tags?: string[];
}
interface TagInputProps {
  id?: string;
  placeholder: string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  readonly?: boolean;
  name?: string;
  tags: Array<tagInterface>;
  setTags: React.Dispatch<React.SetStateAction<tagInterface[]>>;
}

export type {
  InputProps,
  ButtonProps,
  ProfileInterface,
  UserInfo,
  Settings,
  tagInterface,
  TagInputProps,
  newRuleset
};
