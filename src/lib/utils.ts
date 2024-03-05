import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const calculateTotalPages = (
    totalItems: number,
    perPage: number
): number => {
    return Math.ceil(totalItems / perPage);
};

export const calculateSkipAndTake = (
    page: number,
    perPage: number
): { skip: number; take: number } => {
    const skip = (page - 1) * perPage;
    const take = perPage;
    return { skip, take };
};
