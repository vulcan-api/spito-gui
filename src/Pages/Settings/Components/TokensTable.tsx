import { Token } from "../../../lib/interfaces";
import { TbTrash } from "react-icons/tb";

interface TokensTableProps {
    tokens: Token[];
    deleteTokenHandler: (id: number) => Promise<void>;
}

const TokensTable: React.FC<TokensTableProps> = ({
    tokens,
    deleteTokenHandler,
}: TokensTableProps): JSX.Element => {
    return (
        <table className="min-w-full divide-y divide-sky-500 rounded-lg overflow-hidden shadow-darkMain">
            <thead className="text-white bg-borderGray">
                <tr>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                        Name
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                        Expires at
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                        Created at
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody className="bg-bgLight divide-y divide-gray-400">
                {tokens.length > 0 &&
                    tokens.map((token: Token) => (
                        <tr key={token.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-white">
                                            {token.name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">
                                    {token.expiresAt
                                        ? new Date(
                                              token.expiresAt
                                          ).toLocaleDateString()
                                        : "Never"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">
                                    {new Date(
                                        token.createdAt
                                    ).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    className="text-sky-400 hover:text-sky-600"
                                    onClick={() => deleteTokenHandler(token.id)}
                                >
                                    <TbTrash size={30} />
                                </button>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};

export default TokensTable;
