import { TbBriefcase, TbFolder, TbLock } from "react-icons/tb";
import { useEffect, useMemo, useState } from "react";
import { UserActivity } from "../../../lib/interfaces";
import { getUserActivity } from "../../../lib/user";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../Layout/Loader";
import { DatePicker } from "@/Components/ui/date-picker";

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
                <h1 className="text-xl text-foreground">Activity</h1>
                <div className="flex items-center gap-2">
                    <label htmlFor="from" className="mb-2">
                        From:
                    </label>
                    <DatePicker value={fromDate} onChange={setFromDate} />
                    <label htmlFor="to" className="mb-2">
                        To:
                    </label>
                    <DatePicker value={toDate} onChange={setToDate} />
                </div>
            </span>
            {activity && hasActivity ? (
                <>
                    {activity.createdRulesets.length > 0 && (
                        <div className="flex gap-2">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex bg-accent shadow-darkMain items-center justify-center w-10 h-10 p-2 rounded-full">
                                    <TbFolder />
                                </div>
                                <div className="h-full w-1 bg-accent rounded-full shadow-darkMain" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl text-muted-foreground">
                                    Created Rulesets
                                </h2>
                                <ul className="flex flex-col gap-2 p-4 text-xl">
                                    {activity.createdRulesets.map((ruleset) => (
                                        <li key={ruleset.id}>
                                            <Link
                                                to={`/ruleset/${ruleset.id}`}
                                                className="flex items-center gap-2 text-gray-400 w-fit rounded-lg hover:bg-accent shadow-darkMain px-4 transition-all duration-300 ease-in-out"
                                            >
                                                <TbFolder />
                                                <span>{ruleset.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {activity.createdEnvironments.length > 0 && (
                        <div className="flex gap-2">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex bg-accent shadow-darkMain items-center justify-center w-10 h-10 p-2 rounded-full">
                                    <TbBriefcase />
                                </div>
                                <div className="h-full w-1 bg-accent rounded-full shadow-darkMain" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl text-muted-foreground">
                                    Created Environments
                                </h2>
                                <ul className="flex flex-col gap-2 p-4">
                                    {activity.createdEnvironments.map((env) => (
                                        <li key={env.id}>
                                            <Link
                                                to={`/environments/${env.id}`}
                                                className="flex items-center gap-2 text-gray-400 w-fit rounded-lg hover:bg-accent shadow-darkMain px-4 transition-all duration-300 ease-in-out"
                                            >
                                                {env.isPrivate ? (
                                                    <TbLock />
                                                ) : (
                                                    <TbBriefcase />
                                                )}
                                                <span>{env.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </>
            ) : isFetching ? (
                <Loader />
            ) : (
                <p className="text-muted-foreground text-center font-poppins">
                    This user has no activity during this period
                </p>
            )}
        </div>
    );
}
