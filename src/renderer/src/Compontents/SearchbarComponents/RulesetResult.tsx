import { ruleset } from "@renderer/lib/interfaces";
import { TbFolder } from "react-icons/tb";

export default function RulesetResult({ruleset}: {ruleset: ruleset}): JSX.Element {
    return (
      <div className="w-full flex items-center gap-4 text-2xl">
        <TbFolder />
        <p>{ruleset.name}</p>
      </div>
    );
}