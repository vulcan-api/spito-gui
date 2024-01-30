import { rule } from "../../lib/interfaces";
import { TbFile } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function RuleResult({ rule }: { rule: rule }): JSX.Element {
  return (
    <Link to={`/ruleset/${rule.rulesetId}`} className="w-full flex items-center gap-4 text-2xl">
      <TbFile />
      <p>{rule.name}</p>
    </Link>
  );
}
