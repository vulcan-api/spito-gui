import { rule } from "@renderer/lib/interfaces";
import { TbFile } from "react-icons/tb";

export default function RuleResult({ rule }: { rule: rule }): JSX.Element {
  return (
    <div className="w-full flex items-center gap-4 text-2xl">
      <TbFile />
      <p>{rule.name}</p>
    </div>
  );
}
