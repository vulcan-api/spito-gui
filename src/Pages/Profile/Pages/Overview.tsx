import { TbBriefcase, TbFolder, TbLock } from "react-icons/tb";
import Input from "../../../Layout/Input";
import { useEffect, useMemo, useState } from "react";
import { UserActivity } from "../../../lib/interfaces";
import { getUserActivity } from "../../../lib/user";
import { Link, useParams } from "react-router-dom";

export default function Overview(): JSX.Element {
    const { userId = 0 } = useParams<{ userId: string }>();
    const [fromDate, setFromDate] = useState<Date>(
        new Date(new Date().setMonth(new Date().getMonth() - 1))
    );
    const [toDate, setToDate] = useState<Date>(new Date());
    const [activity, setActivity] = useState<UserActivity | null>();

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            const data = await getUserActivity(+userId, fromDate, toDate);
            setActivity(data);
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
            <h1 className="text-2xl">Activity</h1>
            <div className="flex items-center gap-2">
                <Input
                    placeholder="From"
                    type="date"
                    value={fromDate.toISOString().split("T")[0]}
                    onChange={(e) => setFromDate(new Date(e.target.value))}
                />
                <Input
                    placeholder="To"
                    type="date"
                    value={toDate.toISOString().split("T")[0]}
                    onChange={(e) => setToDate(new Date(e.target.value))}
                />
            </div>
            {activity && hasActivity ? (
                <ul className="relative m-0 w-full list-none overflow-hidden p-0">
                    <li className="relative h-fit after:absolute after:left-[2.45rem] after:top-[3.6rem] after:mt-px after:h-[calc(100%-2.45rem)] after:w-px after:bg-[#e0e0e0] after:content-[''] dark:after:bg-neutral-600">
                        <div className="flex items-center p-6 leading-[1.3rem] no-underline focus:outline-none">
                            <span className="mr-3 flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-[#ebedef] text-sm font-medium text-[#40464f]">
                                <TbFolder />
                            </span>
                            <span className="text-neutral-300">
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
                    <li className="relative h-fit after:absolute after:left-[2.45rem] after:top-[3.6rem] after:mt-px after:h-[calc(100%-2.45rem)] after:w-px after:bg-[#e0e0e0] after:content-[''] dark:after:bg-neutral-600">
                        <div className="flex items-center p-6 leading-[1.3rem] no-underline focus:outline-none">
                            <span className="mr-3 flex h-[1.938rem] w-[1.938rem] items-center justify-center rounded-full bg-[#ebedef] text-sm font-medium text-[#40464f]">
                                <TbBriefcase />
                            </span>
                            <span className="text-neutral-500 after:absolute after:flex after:text-[0.8rem] after:content-[data-content] dark:text-neutral-300">
                                Created {activity?.createdEnvironments.length}{" "}
                                {activity?.createdEnvironments.length === 1 ? (
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
                </ul>
            ) : (
                <p className="text-gray-400">
                    This user has no activity during this period
                </p>
            )}
        </div>
    );
}
