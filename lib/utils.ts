import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses "Code,Label" string from backend (e.g. "AE,UAE").
 * Returns { code: 'ae', label: 'UAE' }.
 * Handles both string and array inputs (ACF can return arrays).
 * Fallback: if no comma, label = code.
 */
export function parseCountryString(raw: string | string[] | undefined | null) {
  // Handle array input (ACF fields can be arrays)
  let str: string = '';
  if (Array.isArray(raw)) {
    str = raw[0] || '';
  } else if (typeof raw === 'string') {
    str = raw;
  }

  if (!str) return { code: '', label: '' };

  const parts = str.split(',');
  const code = parts[0].trim().toLowerCase();
  const label = parts[1] ? parts[1].trim() : parts[0].trim();
  return { code, label };
}
