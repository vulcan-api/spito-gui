import Loader from "../Layout/Loader";
import { searchBackend } from "../lib/search";
import { RefObject, useEffect, useRef, useState } from "react";
import { searchBackend as searchBackendInterface } from "../lib/interfaces";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandGroup,
    CommandEmpty,
} from "./ui/command";
import { CommandLoading } from "cmdk";
import UserResult from "./SearchbarComponents/UserResult";
import RuleResult from "./SearchbarComponents/RuleResult";
import RulesetResult from "./SearchbarComponents/RulesetResult";
import EnvironmentResult from "./SearchbarComponents/EnvironmentResults";

export default function Searchbar(): JSX.Element {
    const [results, setResults] = useState<searchBackendInterface>({
        rules: [],
        rulesets: [],
        users: [],
        topResults: [],
        environments: [],
    });
    const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    detectOnAbortingSearch(wrapperRef);

    async function fetchResults(): Promise<void> {
        setIsFetching(true);
        const res = await searchBackend(searchQuery);
        setResults(res.data);
        setIsFetching(false);
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            fetchResults();
        }
    }, [searchQuery]);

    function detectOnAbortingSearch(ref: RefObject<HTMLDivElement>): void {
        useEffect(() => {
            function handleClickOutside(event: Event): void {
                if (
                    ref.current &&
                    !ref.current.contains(event.target as Node)
                ) {
                    setIsUserSearching(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    function checkIfResultsExists(): boolean {
        for (const key in results) {
            if (results[key as keyof searchBackendInterface].length > 0) {
                return true;
            }
        }
        return false;
    }

    return (
        <div className="xl:w-1/4 lg:w-1/3 w-full" ref={wrapperRef}>
            <Command
                className={`border shadow-md w-full relative bg-background overflow-visible ${results || isFetching ? "rounded-t-lg" : "rounded-lg"}`}
            >
                <CommandInput
                    placeholder="Search"
                    onValueChange={(search) => setSearchQuery(search)}
                    onFocus={() => setIsUserSearching(true)}
                />
                {isUserSearching && (
                    <CommandList className="absolute top-full w-full left-0 border border-t-0 rounded-b-lg bg-background">
                        {isFetching && (
                            <CommandLoading className="py-4">
                                <Loader size="w-8 h-8" />
                            </CommandLoading>
                        )}
                        {!isFetching && !checkIfResultsExists() && (
                            <CommandEmpty>No results</CommandEmpty>
                        )}
                        {results.topResults.length > 0 && (
                            <CommandGroup heading="Top Results">
                                {results.topResults.length > 0 &&
                                    //eslint-disable-next-line
                                    results.topResults.map((result: any) => {
                                        return (
                                            <CommandItem key={result?.id}>
                                                {result.type === "user" ? (
                                                    <UserResult
                                                        id={result.id}
                                                        username={
                                                            result.username
                                                        }
                                                    />
                                                ) : result.type === "rule" ? (
                                                    <RuleResult
                                                        rule={result}
                                                        key={result.id}
                                                    />
                                                ) : result.type ===
                                                  "ruleset" ? (
                                                    <RulesetResult
                                                        ruleset={result}
                                                        key={result.id}
                                                    />
                                                ) : (
                                                    <EnvironmentResult
                                                        environment={result}
                                                        key={result.id}
                                                    />
                                                )}
                                            </CommandItem>
                                        );
                                    })}
                            </CommandGroup>
                        )}
                        {results.users.length > 0 && (
                            <CommandGroup heading="Users">
                                {results.users.map((user) => (
                                    <CommandItem key={user.id}>
                                        <UserResult
                                            id={user.id}
                                            username={user.username}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        {results.rules.length > 0 && (
                            <CommandGroup heading="Rules">
                                {results.rules.map((rule) => (
                                    <CommandItem key={rule.id}>
                                        <RuleResult rule={rule} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        {results.rulesets.length > 0 && (
                            <CommandGroup heading="Rulesets">
                                {results.rulesets.map((ruleset) => (
                                    <CommandItem key={ruleset.id}>
                                        <RulesetResult ruleset={ruleset} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        {results.environments.length > 0 && (
                            <CommandGroup heading="Environments">
                                {results.environments.map((environment) => (
                                    <CommandItem key={environment.id}>
                                        <EnvironmentResult
                                            environment={environment}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                )}
            </Command>
        </div>
    );
}
