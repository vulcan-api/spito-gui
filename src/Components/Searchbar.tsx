import Loader from "../Layout/Loader";
import { searchBackend } from "../lib/search";
import { RefObject, useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { searchBackend as searchBackendInterface } from "../lib/interfaces";
import SearchResults from "./SearchbarComponents/SearchResults";
import { twMerge } from "tailwind-merge";

export default function Searchbar(): JSX.Element {
  const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
  const [results, setResults] = useState<searchBackendInterface>({
    rules: [],
    rulesets: [],
    users: [],
    topResults: [],
    environments: []
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  detectOnAbortingSearch(wrapperRef);

  function detectOnAbortingSearch(ref: RefObject<HTMLDivElement>): void {
    useEffect(() => {
      function handleClickOutside(event: Event): void {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsUserSearching(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  async function fetchResults(): Promise<void> {
    if (!searchInputRef.current?.value) {
      return;
    }
    setIsFetching(true);
    const res = await searchBackend(searchInputRef.current?.value as string);
    setResults(res.data);
    setIsFetching(false);
  }

  function checkIfResultsExists(): boolean {
    for (const key in results) {
      if (results[key].length > 0) {
        return true;
      }
    }
    return false;
  }

  return (
    <div
      className={twMerge(
        "flex items-center justify-between relative xl:w-1/4 lg:w-1/3 w-full border-b-[1px] after:absolute after:content-[''] after:w-full after:h-[1px] after:bottom-0 after:left-0",
        isUserSearching
          ? "after:scale-x-100 border-transparent"
          : "after:scale-x-0 border-borderGray",
        "transition-all duration-500 after:duration-500 after:transition-all after:bg-sky-400 after:origin-left"
      )}
      ref={wrapperRef}
    >
      <input
        type="text"
        placeholder="Search"
        ref={searchInputRef}
        className={twMerge(
          "text-xl p-2 appearance-none bg-transparent w-full font-poppins active:outline-none focus:outline-none transition-colors duration-300 placeholder:transition-colors placeholder:duration-300",
          isUserSearching
            ? "text-gray-100 placeholder:text-gray-500"
            : "text-borderGray placeholder:text-borderGray"
        )}
        onFocus={() => setIsUserSearching(true)}
        onChange={fetchResults}
      />
      <BsSearch
        className={twMerge(
          "absolute right-2 top-2 transition-all duration-300",
          isUserSearching ? "text-sky-400" : "text-borderGray"
        )}
      />
      {searchInputRef.current?.value && isUserSearching && (
        <div className="absolute left-0 top-full w-full p-2 h-fit bg-bgLight rounded-b-lg shadow-darkMain text-gray-400 flex flex-col gap-4 border-1 border-t-0 border-borderGray items-center z-50">
          {isFetching ? (
            <Loader size="w-8 h-8" />
          ) : checkIfResultsExists() ? (
            <SearchResults results={results} />
          ) : (
            <p className="text-xl">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}
