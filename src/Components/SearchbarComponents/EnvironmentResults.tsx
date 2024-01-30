import { environment } from "../../lib/interfaces";
import { TbBriefcase } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function EnvironmentResult({
  environment
}: {
  environment: environment;
}): JSX.Element {
  return (
    <Link to={`/environments/${environment.id}`} className="w-full flex items-center gap-4 text-2xl">
      <TbBriefcase />
      <p>{environment.name}</p>
    </Link>
  );
}
