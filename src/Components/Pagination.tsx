import { FaArrowAltCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface PaginationProps {
    total: number;
    perPage: number;
    page: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
    handlePerPageChange: (perPage: number) => void;
}

export default function Pagination({
    total,
    perPage,
    page,
    totalPages,
    handlePageChange,
    handlePerPageChange,
}: PaginationProps): JSX.Element {
    const previousPageDisabled = page === 1;
    const nextPageDisabled = page === totalPages;
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <FaArrowAltCircleLeft
                    className={twMerge(
                        "text-gray-400",
                        previousPageDisabled
                            ? "opacity-50"
                            : "hover:text-gray-500 cursor-pointer"
                    )}
                    onClick={() =>
                        !previousPageDisabled && handlePageChange(page - 1)
                    }
                />
                <span className="text-gray-400">Page</span>
                <span className="text-gray-400">{page}</span>
                <span className="text-gray-400">
                    of {Math.ceil(total / perPage)}
                </span>
                <FaArrowCircleRight
                    className={twMerge(
                        "text-gray-400",
                        nextPageDisabled
                            ? "opacity-50"
                            : "hover:text-gray-500 cursor-pointer"
                    )}
                    onClick={() =>
                        !nextPageDisabled && handlePageChange(page + 1)
                    }
                />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-gray-400">Show</span>
                <Select
                    value={perPage.toString()}
                    onValueChange={(value) => handlePerPageChange(+value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-gray-400">per page</span>
            </div>
        </div>
    );
}
