import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Display creation time relative to current time, e.g. "6 days ago"
export function showTimeAgo(created: number) {
  const now = Date.now()
  const secondsAgo = Math.round((now - created) / 1000)
  if (secondsAgo < 60) return 'just now'
  const minutesAgo = Math.round(secondsAgo / 60)
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`
  }
  const hoursAgo = Math.round(minutesAgo / 60)
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`
  }
  const daysAgo = Math.round(hoursAgo / 24)
  return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`
}

export function showTimeAgoShort(created: number) {
  const now = Date.now()
  const secondsAgo = Math.round((now - created) / 1000)
  if (secondsAgo < 60) return 'now'
  const minutesAgo = Math.round(secondsAgo / 60)
  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`
  }
  const hoursAgo = Math.round(minutesAgo / 60)
  if (hoursAgo < 24) {
    return `${hoursAgo}h ago`
  }
  const daysAgo = Math.round(hoursAgo / 24)
  return `${daysAgo}d ago`
}
