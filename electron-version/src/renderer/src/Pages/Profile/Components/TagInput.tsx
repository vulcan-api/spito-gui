import Tag from "@renderer/Layout/Tag";
import { TagInputProps, tagInterface } from "@renderer/lib/interfaces";
import { getTagHints } from "@renderer/lib/user";
import { RefObject, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function TagInput({
  id,
  placeholder,
  className,
  containerClassName,
  disabled,
  readonly,
  name,
  tags,
  setTags
}: TagInputProps): JSX.Element {
  const [tagHints, setTagHints] = useState<tagInterface[]>([]);
  const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  detectOnAbortingSearch(wrapperRef);

  const deleteTag = (tag: tagInterface): void => {
    setTags((prevTags: tagInterface[]) => prevTags.filter((t) => t.name !== tag.name));
  };

  const addTag = (tag: tagInterface): void => {
    const exists = tags.some((t) => t.name === tag.name);
    if (!exists) {
      setTags((prevTags: tagInterface[]) => [...prevTags, tag]);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    fetchTagHints("");
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Enter") {
        e.preventDefault();
        if (inputRef.current?.value) {
          addTag({ id: Math.random(), name: inputRef.current.value });
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tags]);

  async function fetchTagHints(input: string): Promise<void> {
    const hints = await getTagHints(input);
    if (hints) {
      const filteredHints = hints.tags.filter((tag) => !tags.some((t) => t.name === tag.name));
      setTagHints(filteredHints);
    }
  }

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

  return (
    <>
      <div
        className={twMerge(
          "flex items-center flex-wrap gap-2 max-h-32 mb-4 overflow-y-auto",
          containerClassName
        )}
      >
        {tags.length ? (
          tags.map((tag) => <Tag key={tag.name} tag={tag} onDelete={() => deleteTag(tag)} />)
        ) : (
          <p className="text-center text-gray-500 w-full">Tags will appear here!</p>
        )}
      </div>
      <div className={twMerge("relative", containerClassName)} ref={wrapperRef}>
        <input
          type="text"
          className={twMerge(
            `${className} font-poppins block pl-2.5 pb-2.5 pt-4 pr-12 w-full text-lg text-white bg-transparent ${
              isUserSearching ? "rounded-t-lg" : "rounded-lg"
            } border-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors focus:border-sky-500 border-gray-500`,
            className
          )}
          readOnly={readonly}
          name={name}
          id={id || placeholder}
          placeholder=" "
          disabled={disabled}
          ref={inputRef}
          onChange={(e) => fetchTagHints(e.target.value)}
          onFocus={() => setIsUserSearching(true)}
        />
        <label
          htmlFor={id || placeholder}
          className="absolute font-poppins text-lg cursor-text duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-bgColor px-2 peer-focus:px-2 text-gray-500 peer-focus:text-sky-600 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          {placeholder}
        </label>
        <div
          className={twMerge(
            "absolute w-full max-h-32 overflow-y-auto rounded-b-lg border-2 border-t-0 border-sky-500",
            isUserSearching ? "block" : "hidden"
          )}
        >
          {tagHints.length ? (
            tagHints.map((tag) => (
              <p
                key={tag.id}
                className="text-lg flex items-center justify-between gap-2 px-2 bg-bgColor hover:bg-sky-600 transition-colors text-gray-100 cursor-pointer"
                onClick={() => {
                  addTag(tag);
                  inputRef.current?.focus();
                  fetchTagHints("");
                }}
              >
                <span>{tag.name}</span>
                <span className="opacity-70">{tag.usageCount}</span>
              </p>
            ))
          ) : (
            <p
              className="text-lg flex items-center gap-2 px-2 bg-bgColor transition-colors text-white"
              onClick={() => {
                inputRef.current?.focus();
              }}
            >
              <span className="opacity-70">No existing tags found</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
