import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateFontByLocale (locale: string) {
  return locale === "ka" ? "font-bpgNino" : "font-arial"
}

export const monthOrder: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!
export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL!

export function isLocalStorageAvailable() {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export const separator = (index: number, array: any, separatorType: string = ', ', separatorEnd: string = ".") => index === array.length - 1 ? separatorEnd : separatorType