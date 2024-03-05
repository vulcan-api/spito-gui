import { UserInfo } from "../../lib/interfaces";
import AvatarComponent from "../AvatarComponent";
import { Link } from "react-router-dom";

export default function UserResult({ id, username }: UserInfo): JSX.Element {
    return (
        <Link
            to={`/profile/${id}`}
            className="w-full flex items-center gap-4 text-muted-foreground"
        >
            <AvatarComponent userId={id} username={username} size="small" />
            <p className="text-base">{username}</p>
        </Link>
    );
}
