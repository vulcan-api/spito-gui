import { ruleset } from "../../lib/interfaces";
import { TbFolder } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function RulesetResult({
    ruleset,
}: {
    ruleset: ruleset;
}): JSX.Element {
    return (
        <Link
            to={`/ruleset/${ruleset.id}`}
            className="w-full flex items-center gap-4 text-base text-muted-foreground"
        >
            <TbFolder />
            <p>{ruleset.name}</p>
        </Link>
    );
}
