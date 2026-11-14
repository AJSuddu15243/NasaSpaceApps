import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
/** shadcn class composition: callers may override a component's utility classes. */
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
