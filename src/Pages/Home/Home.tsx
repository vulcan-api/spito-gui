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
import { TbArrowDown, TbArrowUp, TbX } from "react-icons/tb";
import Input from "../../Layout/Input";
import { calculateSkipAndTake, calculateTotalPages } from "../../lib/utils";
import Pagination from "../../Components/Pagination";

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
    const [orderBy, setOrderBy] = useState<"downloads" | "likes" | "saves">(
        "likes"
    );
    const [isDescending, setIsDescending] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [search, setSearch] = useState<string>("");

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
        console.log(searchParam);
        const res = await getEnvironments(
            pageData.skip,
            pageData.take,
            searchedTags.map((t) => t.name),
            searchParam || search,
            orderBy,
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
            <h1 className="text-3xl font-roboto text-center my-8 text-gray-500">
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
                        <p className="text-center w-full text-bgLighter font-poppins text-xl">
                            No trending environments found!
                        </p>
                    )}
                </AnimatePresence>
            </div>
            <h1 className="text-3xl font-roboto text-center my-8 text-gray-500">
                All Environments
            </h1>
            <div className="flex items-center gap-4 w-full">
                <Input
                    placeholder="Search for environment"
                    className="shadow-darkMain"
                    containerClassName="w-80"
                    onChange={handleSearch}
                    value={search}
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
                                className="absolute w-72 h-fit bg-bgColor border-1 border-bgLight shadow-darkMain rounded-lg p-4 z-20 pt-8 top-full"
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
                    <div
                        className="w-fit shadow-darkMain border-1 border-bgLight px-4 py-2 font-poppins text-gray-400 cursor-pointer rounded-full"
                        onClick={() => {
                            isUserSearchingTags ? fetchEnvironments() : "";
                            setIsUserSearchingTags((prev) => !prev);
                        }}
                    >
                        Tags: {searchedTags.length}
                    </div>
                </div>
                <div
                    className={`w-24 flex items-center justify-between transition-colors duration-300 shadow-darkMain border-1 border-bgLight px-4 py-2 font-poppins text-gray-400 cursor-pointer rounded-full`}
                    onClick={() => {
                        setIsDescending((prev) => !prev);
                        fetchEnvironments();
                    }}
                >
                    {isDescending ? "Most" : "Least"}
                    {isDescending ? <TbArrowDown /> : <TbArrowUp />}
                </div>
                <p className="font-poppins text-gray-400">Order by:</p>
                <div
                    className={`${orderBy === "likes" ? "bg-sky-500 hover:bg-sky-600 text-white" : ""} transition-colors duration-300 w-fit shadow-darkMain border-1 border-bgLight px-4 py-2 font-poppins text-gray-400 cursor-pointer rounded-full`}
                    onClick={() => {
                        setOrderBy("likes");
                        fetchEnvironments();
                    }}
                >
                    Likes
                </div>
                <div
                    className={`${orderBy === "downloads" ? "bg-sky-500 hover:bg-sky-600 text-white" : ""} transition-colors duration-300 w-fit shadow-darkMain border-1 border-bgLight px-4 py-2 font-poppins text-gray-400 cursor-pointer rounded-full`}
                    onClick={() => {
                        setOrderBy("downloads");
                        fetchEnvironments();
                    }}
                >
                    Downloads
                </div>
                <div
                    className={`${orderBy === "saves" ? "bg-sky-500 hover:bg-sky-600 text-white" : ""} transition-colors duration-300 w-fit shadow-darkMain border-1 border-bgLight px-4 py-2 font-poppins text-gray-400 cursor-pointer rounded-full`}
                    onClick={() => {
                        setOrderBy("saves");
                        fetchEnvironments();
                    }}
                >
                    Saves
                </div>
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
