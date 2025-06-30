import {
  SingleUser
} from "../apis/user";

/**
 * Converts a number of minutes into a formatted string of hours and minutes.
 * @param num - Total number of minutes.
 * @returns A string in the format "X hour(s) and Y minute(s)".
 */

export function getHoursAndMinutes(totalMinutes: number): { hours: number; minutes: number } {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}
/**
 * Formats time as "X hour(s) and Y minute(s)".
 */
export function timeConvert(num: number): string {
  const { hours, minutes } = getHoursAndMinutes(num);
  return `${hours} hour(s) and ${minutes} minute(s)`;
}
/**
 * Formats time as "Xh Ym", e.g., "2h 30m".
 */
export function formatCompactTime(num: number): string {
  const { hours, minutes } = getHoursAndMinutes(num);
  return `${hours}h ${minutes}m`;
}

export function getUserLabeledTime(user: SingleUser): string {
  const LabeledTime = (user.review ?? 0) + (user.label ?? 0)
  return formatCompactTime(LabeledTime);
}

export function getCurrentTime(user: SingleUser): string {
  const labeledMinutes = (user.review ?? 0) + (user.label ?? 0);
  const certifiedMinutes = (user.hoursCertified ?? 0) * 60; // convert hoursCertified to minutes
  const totalMinutes = labeledMinutes - certifiedMinutes;
  const safeMinutes = totalMinutes < 0 ? 0 : totalMinutes; // avoid negative time
  return formatCompactTime(safeMinutes);
}
