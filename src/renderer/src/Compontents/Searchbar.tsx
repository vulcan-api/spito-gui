import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";

export default function Searchbar(): JSX.Element {
  const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  detectOnAbortingSearch(wrapperRef);

  function detectOnAbortingSearch(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: Event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsUserSearching(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  function fetchResults() {
    console.log("Not implemented yet");
  }

  return (
    <div
      className={`flex items-center justify-between relative xl:w-1/4 lg:w-1/3 md:w-1/2 w-full text-gray-100 border-b-2 after:absolute after:content-[''] after:w-full after:h-[2px] after:bottom-0 after:left-0 ${
        isUserSearching ? "after:scale-100 border-transparent" : "after:scale-0 border-[#4d4d4d]"
      } transition-all duration-300 after:duration-300 after:transition-all after:bg-emerald-500`}
      ref={wrapperRef}
    >
      <input
        type="text"
        placeholder="Search"
        ref={searchInputRef}
        className="text-xl p-2 appearance-none bg-transparent w-full roboto active:outline-none focus:outline-none text-emerald-100"
        onFocus={() => setIsUserSearching(true)}
        onChange={fetchResults}
      />
      <BsSearch
        className={`text-2xl ${
          isUserSearching ? "text-emerald-500" : "text-[#4d4d4d]"
        } transition-all duration-300 cursor-pointer`}
      />
    </div>
  );
}
