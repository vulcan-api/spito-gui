import { userAtom } from "../../../lib/atoms";
import { rule } from "../../../lib/interfaces";
import { likeOrDislikeRule } from "../../../lib/user";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useState } from "react";
import toast from "react-hot-toast";
import { TbPlus, TbStar, TbStarFilled, TbTrash } from "react-icons/tb";

export default function Rule({
    rule,
    i,
    addRuleToEnvironment,
    deleteRuleFronEnvironment,
}: {
    rule: rule;
    i: number;
    addRuleToEnvironment?: (ruleId: number) => void;
    deleteRuleFronEnvironment?: (ruleId: number) => void;
}): JSX.Element {
    const [isLiked, setIsLiked] = useState<boolean>(rule.isLiked || false);
    const [likesCount, setLikesCount] = useState<number>(rule.likes || 0);
    const loggedUserData = useAtomValue(userAtom);

    async function changeRuleLikeStatus(): Promise<void> {
        if (!loggedUserData.id) {
            toast.error("You need to be logged in to like rules!");
            return;
        }
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => prev + (isLiked ? -1 : 1));
        const res = await likeOrDislikeRule(rule.id);
        if (!res) {
            setIsLiked((prev) => !prev);
            setLikesCount((prev) => prev + (isLiked ? 1 : -1));
            toast.error("Something went wrong!");
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.2 + 0.1 * i, duration: 0.2 },
            }}
            className="text-xl font-poppins p-4 flex flex-col gap-4 rounded-xl border bg-background text-card-foreground shadow"
        >
            <span className="flex items-center justify-between">
                <span className="text-xl font-rubik text-foreground">
                    {rule.name}
                </span>
                <span className="flex items-center gap-2 cursor-pointer">
                    {likesCount}
                    {isLiked ? (
                        <span
                            className="relative"
                            onClick={changeRuleLikeStatus}
                        >
                            <TbStarFilled className="text-yellow-500 cursor-pointer" />
                            <TbStarFilled className="text-yellow-500 cursor-pointer animate-ping-once absolute inset-0" />
                        </span>
                    ) : (
                        <TbStar
                            className="text-yellow-500 cursor-pointer"
                            onClick={changeRuleLikeStatus}
                        />
                    )}
                    {addRuleToEnvironment && (
                        <TbPlus
                            className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => addRuleToEnvironment(rule.id)}
                        />
                    )}
                    {deleteRuleFronEnvironment && (
                        <TbTrash
                            className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => deleteRuleFronEnvironment(rule.id)}
                        />
                    )}
                </span>
            </span>
            <p className="text-sm text-muted-foreground">
                Created:{" "}
                {formatDistanceToNow(rule.createdAt, { addSuffix: true })}
            </p>
            {rule.updatedAt !== rule.createdAt && rule.updatedAt && (
                <p className="text-sm text-muted-foreground">
                    Updated:{" "}
                    {formatDistanceToNow(rule.updatedAt, { addSuffix: true })}
                </p>
            )}
        </motion.div>
    );
}
