/**
 * ISS API module
 *
 * All calls go through /api/iss (Vercel serverless proxy) so that:
 *  - In production (HTTPS) the browser never makes an HTTP request (mixed-content blocked).
 *  - In development the Vite dev-server proxy (vite.config.js) forwards /api/iss → the handler.
 *
 * open-notify response shapes:
 *   position:    { iss_position: { latitude, longitude }, timestamp, message }
 *   astronauts:  { people: [{ name, craft }], number, message }
 */

/**
 * Fetch current ISS position via serverless proxy.
 * Returns: { latitude, longitude, timestamp }
 */
export async function fetchISSPosition() {
  const res = await fetch('/api/iss?endpoint=position');
  if (!res.ok) throw new Error(`ISS position fetch failed: ${res.status}`);
  const d = await res.json();

  return {
    latitude:  parseFloat(d.iss_position.latitude),
    longitude: parseFloat(d.iss_position.longitude),
    timestamp: d.timestamp, // Unix seconds
  };
}

/**
 * Fetch people currently in space via serverless proxy.
 * Returns: { number, people: [{ name, craft }] }
 */
export async function fetchAstronauts() {
  const res = await fetch('/api/iss?endpoint=astronauts');
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
      addr.city     ||
      addr.town     ||
      addr.village  ||
      addr.county   ||
      addr.state    ||
      addr.country  ||
      data.display_name?.split(',')[0] ||
      'Unknown'
    );
  } catch {
    return 'Over the ocean';
  }
}
