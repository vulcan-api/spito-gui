import { AnimatePresence, motion } from "framer-motion";
import {
    getEnvironments,
    getTrendingEnvironments,
} from "../../lib/environments";
import { environment, tagInterface } from "../../lib/interfaces";
import { useState, useEffect } from "react";
import Environment from "../Profile/Components/Environment";
import toast from "react-hot-toast";
import Loader from "../../Layout/Loader";
import TagInput from "../Profile/Components/TagInput";
import {
    TbArrowDown,
    TbArrowUp,
    TbCaretUpDown,
    TbCheck,
    TbX,
} from "react-icons/tb";
import { Input } from "@/Components/ui/input";
import { calculateSkipAndTake, calculateTotalPages, cn } from "../../lib/utils";
import Pagination from "../../Components/Pagination";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/Components/ui/command";

const filters = [
    {
        value: "likes",
        label: "Likes",
    },
    {
        value: "downloads",
        label: "Downloads",
    },
    {
        value: "saves",
        label: "Saves",
    },
];

export default function Home(): JSX.Element {
    const [trendingEnvironments, setTrendingEnvironments] = useState<
        environment[]
    >([]);
    const [
        isTrendingEnvironmentBeingFetched,
        setIsTrendingEnvironmentBeingFetched,
    ] = useState<boolean>(true);
    const [environments, setEnvironments] = useState<environment[]>([]);
    const [isEnvironmentBeingFetched, setIsEnvironmentBeingFetched] =
        useState<boolean>(true);
    const [searchedTags, setSearchedTags] = useState<tagInterface[]>([]);
    const [isUserSearchingTags, setIsUserSearchingTags] =
        useState<boolean>(false);
    const [orderBy, setOrderBy] = useState<
        "downloads" | "likes" | "saves" | ""
    >("likes");
    const [isDescending, setIsDescending] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const fetchTrendingEnvironments = async () => {
        setIsTrendingEnvironmentBeingFetched(true);
        const res = await getTrendingEnvironments(0, 10);
        if (res.status !== 200) {
            toast.error("Failed to fetch trending environments!");
            return;
        } else {
            setTrendingEnvironments(res.data);
            setIsTrendingEnvironmentBeingFetched(false);
        }
    };

    const fetchEnvironments = async (
        searchParam?: string,
        pageParam?: number,
        perPageParam?: number
    ) => {
        setIsEnvironmentBeingFetched(true);
        const pageData = calculateSkipAndTake(
            pageParam || page,
            perPageParam || perPage
        );
        //eslint-disable-next-line
        const res = await getEnvironments(
            pageData.skip,
            pageData.take,
            searchedTags.map((t) => t.name),
            searchParam || search,
            orderBy === "" ? undefined : orderBy,
            isDescending
        );
        if (res.status !== 200) {
            toast.error("Failed to fetch environments!");
            return;
        } else {
            setEnvironments(res.data.data);
            setTotal(res.data.count);
            setTotalPages(calculateTotalPages(res.data.count, perPage));
            setIsEnvironmentBeingFetched(false);
        }
    };

    function handlePageChange(pageParam: number): void {
        setPage(pageParam);
        fetchEnvironments(search, pageParam, perPage);
    }

    function handlePerPageChange(perPageParam: number): void {
        setPerPage(perPageParam);
        fetchEnvironments(search, 1, perPageParam);
    }

    function handleSearch(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearch(event.target.value);
        fetchEnvironments(event.target.value, 1, perPage);
    }

    useEffect(() => {
        fetchTrendingEnvironments();
        fetchEnvironments();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            key="home"
            className="flex-1 w-4/5 mx-auto flex flex-col px-16 overflow-y-auto my-4 text-white"
        >
            {(isTrendingEnvironmentBeingFetched ||
                trendingEnvironments.length !== 0) && (
                <>
                    <h1 className="text-3xl font-poppins text-center my-8 text-gray-500">
                        Trending Environments
                    </h1>
                    <div className="flex flex-row gap-4 flex-wrap my-8">
                        <AnimatePresence>
                            {isTrendingEnvironmentBeingFetched ? (
                                <Loader />
                            ) : trendingEnvironments.length > 0 ? (
                                trendingEnvironments.map((environment, i) => (
                                    <Environment
                                        key={environment.id}
                                        environment={environment}
                                        index={i + 1}
                                        canChangeLogo={false}
                                        view="compact"
                                    />
                                ))
                            ) : (
                                <p className="text-center w-full text-muted-foreground font-poppins text-xl">
                                    No trending environments found!
                                </p>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
            <h1 className="text-3xl font-poppins text-center my-8 text-gray-500">
                All Environments
            </h1>
            <div className="flex items-center gap-4 w-full">
                <Input
                    placeholder="Search for environments"
                    className="w-80"
                    onChange={handleSearch}
                    defaultValue={search}
                />
                <div className="relative ml-auto">
                    <AnimatePresence>
                        {isUserSearchingTags && (
                            <motion.div
                                initial={{ opacity: 0, top: "130%" }}
                                animate={{
                                    opacity: 1,
                                    top: "110%",
                                    transition: { duration: 0.2 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.1 },
                                }}
                                className="absolute w-72 h-fit bg-background border rounded-lg p-4 z-20 pt-8 top-full"
                            >
                                <TbX
                                    className="absolute cursor-pointer inset-2 z-50"
                                    onClick={() => {
                                        setIsUserSearchingTags(false);
                                        fetchEnvironments();
                                    }}
                                />
                                <TagInput
                                    placeholder="Search for tags"
                                    tags={searchedTags}
                                    setTags={setSearchedTags}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Button
                        variant="outline"
                        onClick={() => {
                            isUserSearchingTags ? fetchEnvironments() : "";
                            setIsUserSearchingTags((prev) => !prev);
                        }}
                    >
                        Tags: {searchedTags.length}
                    </Button>
                </div>
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsDescending((prev) => !prev);
                        fetchEnvironments();
                    }}
                >
                    {isDescending ? "Most" : "Least"}
                    {isDescending ? <TbArrowDown /> : <TbArrowUp />}
                </Button>
                <p className="font-poppins text-gray-400">Order by:</p>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-[200px] justify-between"
                        >
                            {orderBy
                                ? filters.find(
                                      (filter) => filter.value === orderBy
                                  )?.label
                                : "Select filter..."}
                            <TbCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search filters..." />
                            <CommandEmpty>No filter found.</CommandEmpty>
                            <CommandGroup>
                                {filters.map((filter) => (
                                    <CommandItem
                                        key={filter.value}
                                        value={filter.value}
                                        onSelect={(currentValue) => {
                                            setOrderBy(
                                                currentValue === filter.value
                                                    ? (filter.value as any)
                                                    : currentValue
                                            );
                                            setIsOpen(false);
                                            fetchEnvironments();
                                        }}
                                    >
                                        <TbCheck
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                orderBy === filter.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {filter.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            {isEnvironmentBeingFetched ? (
                <Loader />
            ) : environments.length > 0 ? (
                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex flex-row gap-4 flex-wrap">
                        <AnimatePresence>
                            {environments.map((environment, i) => (
                                <Environment
                                    key={environment.id}
                                    environment={environment}
                                    index={i + 1}
                                    canChangeLogo={false}
                                    view="compact"
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    <Pagination
                        total={total}
                        perPage={perPage}
                        page={page}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                        handlePerPageChange={handlePerPageChange}
                    />
                </div>
            ) : (
                <p className="text-center w-full text-bgLighter font-poppins text-xl">
                    No environments found!
                </p>
            )}
        </motion.div>
    );
}
