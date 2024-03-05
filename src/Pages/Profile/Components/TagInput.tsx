import { Input } from "@/Components/ui/input";
import Tag from "../../../Layout/Tag";
import { TagInputProps, tagInterface } from "../../../lib/interfaces";
import { getTagHints } from "../../../lib/user";
import { RefObject, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Separator } from "@/Components/ui/separator";

export default function TagInput({
    id,
    placeholder,
    className,
    containerClassName,
    disabled,
    readonly,
    name,
    tags,
    setTags,
}: TagInputProps): JSX.Element {
    const [tagHints, setTagHints] = useState<tagInterface[]>([]);
    const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    detectOnAbortingSearch(wrapperRef);

    const deleteTag = (tag: tagInterface): void => {
        setTags((prevTags: tagInterface[]) =>
            prevTags.filter((t) => t.name !== tag.name)
        );
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
            const filteredHints = hints.tags.filter(
                (tag) => !tags.some((t) => t.name === tag.name)
            );
            setTagHints(filteredHints);
        }
    }

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

    return (
        <>
            <div
                className={twMerge(
                    "flex items-center flex-wrap gap-2 max-h-32 mb-4 overflow-y-auto",
                    containerClassName
                )}
            >
                {tags.length ? (
                    tags.map((tag, i) => (
                        <>
                            <Tag
                                key={tag.name}
                                tag={tag}
                                onDelete={() => deleteTag(tag)}
                            />
                            {i !== tags.length - 1 && (
                                <Separator
                                    orientation="vertical"
                                    className="h-6"
                                />
                            )}
                        </>
                    ))
                ) : (
                    <p className="text-center text-gray-500 w-full">
                        Tags will appear here!
                    </p>
                )}
            </div>
            <div
                className={twMerge("relative", containerClassName)}
                ref={wrapperRef}
            >
                <Input
                    ref={inputRef}
                    onChange={(e) => fetchTagHints(e.target.value)}
                    onFocus={() => setIsUserSearching(true)}
                    className={
                        isUserSearching
                            ? "rounded-b-none" + className
                            : "" + className
                    }
                    disabled={disabled}
                    readOnly={readonly}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                />
                <div
                    className={twMerge(
                        "absolute w-full max-h-32 overflow-y-auto !rounded-b-lg border bg-background !border-t-transparent border-primary",
                        isUserSearching ? "block" : "hidden"
                    )}
                >
                    {tagHints.length > 0 ? (
                        tagHints.map((tag) => (
                            <p
                                key={tag.id}
                                className="text-lg flex items-center justify-between gap-2 px-2 bg-bgColor hover:bg-primary/20 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                                onClick={() => {
                                    addTag(tag);
                                    inputRef.current?.focus();
                                    fetchTagHints("");
                                }}
                            >
                                <span>{tag.name}</span>
                                <span>{tag.usageCount}</span>
                            </p>
                        ))
                    ) : (
                        <p
                            className="text-base flex items-center gap-2 p-2 bg-bgColor text-center transition-colors text-foreground/40"
                            onClick={() => {
                                inputRef.current?.focus();
                            }}
                        >
                            <span>No existing tags found</span>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
