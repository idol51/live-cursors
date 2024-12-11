import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const throttle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  let lastCall: number = 0;

  return function (...arg: Parameters<T>) {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...arg);
    }
  };
};
