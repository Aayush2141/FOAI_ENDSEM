/**
 * General formatting utilities.
 */

/**
 * Format a Date or ISO string as "May 8, 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a Date as "HH:MM:SS"
 */
export function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Format a number to N decimal places
 */
export function toFixed(num, decimals = 4) {
  return Number(num).toFixed(decimals);
}

/**
 * Format speed (km/h) for display
 */
export function formatSpeed(speed) {
  if (!speed || speed < 0) return '—';
  return `${Math.round(speed).toLocaleString()} km/h`;
}

/**
 * Format a Unix timestamp as a readable time
 */
export function formatUnixTime(ts) {
  return formatTime(new Date(ts * 1000));
}

/**
 * Truncate a string to N chars
 */
export function truncate(str, max = 80) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

/**
 * Relative time (e.g. "3 minutes ago")
 */
export function relativeTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return formatDate(d);
}
