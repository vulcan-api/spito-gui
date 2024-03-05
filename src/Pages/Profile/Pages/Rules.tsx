import Loader from "../../../Layout/Loader";
import { rule } from "../../../lib/interfaces";
import { fetchUserRules } from "../../../lib/user";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Rule from "../Components/Rule";

export default function Rules(): JSX.Element {
    const [rules, setRules] = useState<Array<rule>>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const { userId = 0 } = useParams<{ userId: string }>();

    async function fetchRules(): Promise<void> {
        setIsFetching(true);
        const fetchedRules = await fetchUserRules(+userId, 0, 10);
        if (fetchedRules) {
            setIsFetching(false);
            setRules(fetchedRules);
        }
    }

    useEffect(() => {
        fetchRules();
    }, [userId]);

    return (
        <div className="w-full grid grid-cols-3 gap-8 mt-8">
            {isFetching ? (
                <Loader size="w-16 h-16 col-start-2" />
            ) : (
                <AnimatePresence>
                    {rules.length > 0 ? (
                        rules.map((rule, i) => (
                            <Rule rule={rule} i={i} key={rule.id} />
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground text-xl font-poppins mt-2 col-start-2">
                            This user has no rules!
                        </p>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
