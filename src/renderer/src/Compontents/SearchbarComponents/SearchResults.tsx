import EnvironmentResult from "./EnvironmentResults";
import RuleResult from "./RuleResult";
import RulesetResult from "./RulesetResult";
import UserResult from "./UserResult";
import { searchBackend } from "@renderer/lib/interfaces";

export default function SearchResults({ results }: { results: searchBackend }): JSX.Element {
  return (
    <>
      {results.topResults.length > 0 &&
        results.topResults.map((result: any) => {
          if (result?.type === "user") {
            return <UserResult key={result.id} id={result.id} username={result.username} />;
          } else if (result?.type === "rule") {
            return <RuleResult rule={result} key={result.id} />;
          } else {
            return <RulesetResult ruleset={result} key={result.id} />;
          }
        })}
      {results.users.length > 0 && (
        <>
          {results.topResults.length > 0 && (
            <div className="w-full h-[1px] bg-borderGray rounded-full" />
          )}
          <p className="text-left w-full text-xl">Users:</p>
          {results.users.map((user) => (
            <UserResult key={user.id} id={user.id} username={user.username} />
          ))}
        </>
      )}
      {results.rules.length > 0 && (
        <>
          {(results.users.length > 0 || results.users.length > 0) && (
            <div className="w-full h-[1px] bg-borderGray rounded-full" />
          )}
          <p className="text-left w-full text-xl">Rules:</p>
          {results.rules.map((rule) => (
            <RuleResult rule={rule} key={rule.id} />
          ))}
        </>
      )}
      {results.rulesets.length > 0 && (
        <>
          {(results.rules.length > 0 ||
            results.users.length > 0 ||
            results.topResults.length > 0) && (
            <div className="w-full h-[1px] bg-borderGray rounded-full" />
          )}
          <p className="text-left w-full text-xl">Rulesets:</p>
          {results.rulesets.map((ruleset) => (
            <RulesetResult ruleset={ruleset} key={ruleset.id} />
          ))}
        </>
      )}
      {results.rulesets.length > 0 && (
        <>
          {(results.environments.length > 0 ||
            results.rules.length > 0 ||
            results.users.length > 0 ||
            results.topResults.length > 0) && (
            <div className="w-full h-[1px] bg-borderGray rounded-full" />
          )}
          <p className="text-left w-full text-xl">Environments:</p>
          {results.environments.map((environment) => (
            <EnvironmentResult environment={environment} key={environment.id} />
          ))}
        </>
      )}
    </>
  );
}
