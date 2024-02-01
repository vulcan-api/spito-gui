import { TbBriefcase, TbFolder, TbLock } from "react-icons/tb";
import { useEffect, useMemo, useState } from "react";
import { UserActivity } from "../../../lib/interfaces";
import { getUserActivity } from "../../../lib/user";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../Layout/Loader";

export default function Overview(): JSX.Element {
    const { userId = 0 } = useParams<{ userId: string }>();
    const [fromDate, setFromDate] = useState<Date>(
        new Date(new Date().setMonth(new Date().getMonth() - 1))
    );
    const [toDate, setToDate] = useState<Date>(new Date());
    const [activity, setActivity] = useState<UserActivity | null>();
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            setIsFetching(true);
            const data = await getUserActivity(+userId, fromDate, toDate);
            setActivity(data);
            setIsFetching(false);
        };
        fetchData();
    }, [fromDate, toDate]);

    const hasActivity = useMemo(() => {
        if (!activity) return false;
        return (
            activity?.createdEnvironments.length > 0 ||
            activity?.createdRulesets.length > 0
        );
    }, [activity]);

    return (
        <div className="flex flex-col gap-4 mt-2">
            <span className="flex justify-between items-center">
                <h1 className="text-2xl">Activity</h1>
                <div className="flex items-center gap-2">
                    <label htmlFor="from" className="mb-2">
                        From:
                    </label>
                    <input
                        placeholder="From"
                        type="date"
                        id="from"
                        value={fromDate.toISOString().split("T")[0]}
                        onChange={(e) => setFromDate(new Date(e.target.value))}
                        className="appearance-none bg-bgColor rounded-md p-2 text-gray-400"
                    />
                    <label htmlFor="to" className="mb-2">
                        To:
                    </label>
                    <input
                        placeholder="To"
                        type="date"
                        id="to"
                        value={toDate.toISOString().split("T")[0]}
                        onChange={(e) => setToDate(new Date(e.target.value))}
                        className="appearance-none bg-bgColor rounded-md p-2 text-gray-400"
                    />
                </div>
            </span>
            {activity && hasActivity ? (
                <ul className="relative m-0 w-full list-none overflow-hidden p-0">
                    {activity?.createdRulesets.length > 0 && (
                        <li className="relative h-fit after:absolute after:left-[2.72rem] after:top-[3.6rem] after:h-[calc(100%-2.45rem)] after:w-px after:bg-borderGray after:content-[''] dark:after:bg-neutral-600">
                            <div className="flex items-center p-6 leading-[1.3rem] no-underline focus:outline-none">
                                <span className="mr-3 flex w-10 h-10 items-center justify-center rounded-full bg-borderGray text-md text-gray-200">
                                    <TbFolder />
                                </span>
                                <span>
                                    Created {activity?.createdRulesets.length}{" "}
                                    {activity?.createdRulesets.length === 1 ? (
                                        <span>ruleset</span>
                                    ) : (
                                        <span>rulesets</span>
                                    )}
                                </span>
                            </div>
                            <div className="overflow-hidden pb-6 pl-[3.75rem] pr-6 flex flex-col">
                                {activity?.createdRulesets.map((ruleset) => (
                                    <Link
                                        to={`/ruleset/${ruleset.id}`}
                                        className="hover:underline text-2xl text-gray-400 font-roboto mb-2"
                                        key={ruleset.id}
                                    >
                                        <TbFolder className="inline mr-2" />
                                        {ruleset.name}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    )}
                    {activity?.createdEnvironments.length > 0 && (
                        <li className="relative h-fit after:absolute after:left-[2.72rem] after:top-[3.6rem] after:h-[calc(100%-2.45rem)] after:w-px after:bg-borderGray after:content-[''] dark:after:bg-neutral-600">
                            <div className="flex items-center p-6 leading-[1.3rem] no-underline focus:outline-none">
                                <span className="mr-3 flex text-gray-200 h-10 w-10 items-center justify-center rounded-full bg-borderGray text-md font-medium">
                                    <TbBriefcase />
                                </span>
                                <span className="after:absolute after:flex after:text-[0.8rem] after:content-[data-content]">
                                    Created{" "}
                                    {activity?.createdEnvironments.length}{" "}
                                    {activity?.createdEnvironments.length ===
                                    1 ? (
                                        <span>environment</span>
                                    ) : (
                                        <span>environments</span>
                                    )}
                                </span>
                            </div>
                            <div className="overflow-hidden pb-6 pl-[3.75rem] pr-6 flex flex-col">
                                {activity?.createdEnvironments.map(
                                    (environment) => (
                                        <Link
                                            to={`/environments/${environment.id}`}
                                            className="hover:underline text-2xl text-gray-400 font-roboto mb-2"
                                            key={environment.id}
                                        >
                                            {environment.isPrivate ? (
                                                <TbLock className="inline mr-2" />
                                            ) : (
                                                <TbBriefcase className="inline mr-2" />
                                            )}
                                            {environment.name}
                                        </Link>
                                    )
                                )}
                            </div>
                        </li>
                    )}
                </ul>
            ) : isFetching ? (
                <Loader />
            ) : (
                <p className="text-gray-400">
                    This user has no activity during this period
                </p>
            )}
        </div>
    );
}
