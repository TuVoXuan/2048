import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MoveKeyCodes } from "../constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export function getTwoRandomItems<T>(arr: T[]): [T, T] | null {
  if (arr.length < 2) return null;

  const firstIndex = Math.floor(Math.random() * arr.length);
  let secondIndex = Math.floor(Math.random() * arr.length);

  // ensure distinct
  while (secondIndex === firstIndex) {
    secondIndex = Math.floor(Math.random() * arr.length);
  }

  return [arr[firstIndex], arr[secondIndex]];
}

export function getRandomTwoOrFour(): 2 | 4 {
  return Math.random() < 0.1 ? 4 : 2;
}

export function isValidMoveKey(code: string) {
  return (
    code === MoveKeyCodes.ArrowDown ||
    code === MoveKeyCodes.ArrowLeft ||
    code === MoveKeyCodes.ArrowRight ||
    code === MoveKeyCodes.ArrowUp
  );
}
