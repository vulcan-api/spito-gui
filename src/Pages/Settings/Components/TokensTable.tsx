import {
    Table,
    TableCaption,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/Components/ui/table";
import { Token } from "../../../lib/interfaces";
import { Button } from "@/Components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

interface TokensTableProps {
    tokens: Token[];
    deleteTokenHandler: (id: number) => Promise<void>;
}

const TokensTable: React.FC<TokensTableProps> = ({
    tokens,
    deleteTokenHandler,
}: TokensTableProps): JSX.Element => {
    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Expires at</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tokens.length > 0 &&
                    tokens.map((token: Token) => (
                        <TableRow key={token.id}>
                            <TableCell>{token.name}</TableCell>
                            <TableCell>
                                {token.expiresAt
                                    ? new Date(
                                          token.expiresAt
                                      ).toLocaleDateString()
                                    : "Never"}
                            </TableCell>
                            <TableCell>
                                {new Date(token.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    onClick={() => deleteTokenHandler(token.id)}
                                >
                                    <TrashIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
};

export default TokensTable;
