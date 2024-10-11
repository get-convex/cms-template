import { useRef } from "react";
import { useQuery } from "convex/react";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Display creation time relative to current time, e.g. "6 days ago"
export function showTimeAgo(created: number) {
  const now = Date.now();
  const secondsAgo = Math.round((now - created) / 1000);
  if (secondsAgo < 60) return "just now";
  const minutesAgo = Math.round(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  }
  const hoursAgo = Math.round(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  }
  const daysAgo = Math.round(hoursAgo / 24);
  return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
}

export function showTimeAgoShort(created: number) {
  const now = Date.now();
  const secondsAgo = Math.round((now - created) / 1000);
  if (secondsAgo < 60) return "now";
  const minutesAgo = Math.round(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`;
  }
  const hoursAgo = Math.round(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo}h ago`;
  }
  const daysAgo = Math.round(hoursAgo / 24);
  return `${daysAgo}d ago`;
}

/**
 * https://github.com/get-convex/convex-helpers/blob/main/src/hooks/useStableQuery.ts
 * Drop-in replacement for useQuery intended to be used with a parametrized query.
 * Unlike useQuery, useStableQuery does not return undefined while loading new
 * data when the query arguments change, but instead will continue to return
 * the previously loaded data until the new data has finished loading.
 *
 * See https://stack.convex.dev/help-my-app-is-overreacting for details.
 *
 * @param name - string naming the query function
 * @param ...args - arguments to be passed to the query function
 * @returns UseQueryResult
 */
export const useStableQuery = ((name, ...args) => {
  const result = useQuery(name, ...args);
  const stored = useRef(result); // ref objects are stable between rerenders

  // result is only undefined while data is loading
  // if a freshly loaded result is available, use the ref to store it
  if (result !== undefined) {
    stored.current = result;
  }

  // undefined on first load, stale data while loading, fresh data after loading
  return stored.current;
}) as typeof useQuery;
