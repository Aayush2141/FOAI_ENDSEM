/**
 * ISS API module
 *
 * Position + astronauts: api.open-notify.org (no rate limit, CORS-enabled)
 * Reverse geocoding: Nominatim (openstreetmap.org)
 *
 * open-notify position response:
 *   { iss_position: { latitude, longitude }, timestamp, message }
 * open-notify astronauts response:
 *   { people: [{ name, craft }], number, message }
 */

const OPEN_NOTIFY = 'http://api.open-notify.org';

/**
 * Fetch current ISS position.
 * Returns: { latitude, longitude, timestamp }
 * Speed is calculated by the hook via Haversine between two samples.
 */
export async function fetchISSPosition() {
  const res = await fetch(`${OPEN_NOTIFY}/iss-now.json`);
  if (!res.ok) throw new Error(`ISS position fetch failed: ${res.status}`);
  const d = await res.json();

  return {
    latitude: parseFloat(d.iss_position.latitude),
    longitude: parseFloat(d.iss_position.longitude),
    timestamp: d.timestamp, // Unix seconds
  };
}

/**
 * Fetch people currently in space.
 * Returns: { number, people: [{ name, craft }] }
 */
export async function fetchAstronauts() {
  const res = await fetch(`${OPEN_NOTIFY}/astros.json`);
  if (!res.ok) throw new Error(`Astronauts fetch failed: ${res.status}`);
  const data = await res.json();
  return {
    number: data.number,
    people: data.people,
  };
}

/**
 * Reverse geocode a lat/lon → nearest place name via Nominatim.
 * Called infrequently (throttled in the hook).
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) return 'Over the ocean';
    const data = await res.json();
    const addr = data.address || {};
    return (
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state ||
      addr.country ||
      data.display_name?.split(',')[0] ||
      'Unknown'
    );
  } catch {
    return 'Over the ocean';
  }
}
