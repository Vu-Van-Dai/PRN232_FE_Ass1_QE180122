import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions,
  locale = "en-US",
) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "0";

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function formatPriceInput(value: string) {
  const digitsOnly = value.replace(/[^0-9]/g, "");
  if (digitsOnly === "") return "";

  const normalized = digitsOnly.replace(/^0+(?=\d)/, "");
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parsePriceInput(value: string) {
  const digitsOnly = value.replace(/[^0-9]/g, "");
  if (digitsOnly === "") return undefined;
  const num = Number(digitsOnly);
  return Number.isFinite(num) ? num : undefined;
}
