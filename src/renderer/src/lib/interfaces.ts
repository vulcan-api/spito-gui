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

interface backendResponse<T> {
  status: number;
  data: T;
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
  usageCount?: number;
}

interface newRuleset {
  description?: string;
  url: string;
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

interface ruleset {
  id: number;
  name: string;
  branch: string;
  description?: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  tags: Array<tagInterface>;
  rules: Array<rule>;
}

interface rule {
  id: number;
  name: string;
  path: string;
  rulesetId: number;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  isLiked?: boolean;
}

interface searchBackend {
  rules: Array<rule>;
  rulesets: Array<ruleset>;
  users: Array<UserInfo>;
  topResults: Array<unknown>;
}

interface Token {
  id: number;
  name: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type currentPageType = "about" | "tokens" | "2fa" | "changePassword";

interface TwoFAQrCode {
  url: string;
}

interface newEnvironment {
  name: string;
  description?: string;
  isPrivate: boolean;
  tags: Array<string>;
}

interface environment {
  id: number;
  name: string;
  description?: string;
  tags: Array<tagInterface>;
  createdAt: Date;
  updatedAt: Date;
  isLiked: boolean;
  likes: number;
  user: UserInfo;
}

export type {
  InputProps,
  ButtonProps,
  ProfileInterface,
  UserInfo,
  Settings,
  tagInterface,
  TagInputProps,
  newRuleset,
  ruleset,
  rule,
  searchBackend,
  Token,
  currentPageType,
  backendResponse,
  TwoFAQrCode,
  newEnvironment,
  environment
};
