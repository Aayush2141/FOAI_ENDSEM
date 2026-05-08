import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchISSPosition, fetchAstronauts, reverseGeocode } from '../api/issApi';
import { haversineDistance } from '../utils/haversine';

const MAX_POSITIONS = 15;
const MAX_SPEED_HISTORY = 30;
const POLL_INTERVAL_MS = 15000; // 15 seconds

export function useISSTracker() {
  const [position, setPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [speed, setSpeed] = useState(null);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [nearestPlace, setNearestPlace] = useState('—');
  const [astronauts, setAstronauts] = useState({ number: 0, people: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const lastPosRef = useRef(null);
  const lastTsRef = useRef(null);
  const geocodeTimeoutRef = useRef(null);
  const isFetchingRef = useRef(false); // guard against concurrent fetches

  const fetchPosition = useCallback(async () => {
    // Prevent concurrent requests (e.g. if interval fires while previous is still pending)
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setError(null);
      const pos = await fetchISSPosition();

      // Calculate speed via Haversine between consecutive samples
      if (lastPosRef.current && lastTsRef.current) {
        const distKm = haversineDistance(
          lastPosRef.current.latitude,
          lastPosRef.current.longitude,
          pos.latitude,
          pos.longitude
        );
        const deltaHours = (pos.timestamp - lastTsRef.current) / 3600;
        if (deltaHours > 0) {
          // Clamp to realistic ISS range
          const raw = distKm / deltaHours;
          const kmh = Math.min(Math.max(raw, 25000), 30000);
          setSpeed(kmh);
          setSpeedHistory((prev) => {
            const entry = {
              speed: Math.round(kmh),
              label: new Date(pos.timestamp * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              }),
            };
            return [...prev, entry].slice(-MAX_SPEED_HISTORY);
          });
        }
      }

      lastPosRef.current = pos;
      lastTsRef.current = pos.timestamp;

      setPosition(pos);
      setPositions((prev) => [...prev, pos].slice(-MAX_POSITIONS));

      // Throttled geocode — not every 15s to avoid Nominatim rate limits
      clearTimeout(geocodeTimeoutRef.current);
      geocodeTimeoutRef.current = setTimeout(async () => {
        const place = await reverseGeocode(pos.latitude, pos.longitude);
        setNearestPlace(place);
      }, 500);

    } catch (err) {
      setError(err.message || 'Failed to fetch ISS position');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const fetchAstronautsData = useCallback(async () => {
    try {
      const data = await fetchAstronauts();
      setAstronauts(data);
    } catch (err) {
      console.error('Failed to fetch astronauts:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosition();
    fetchAstronautsData();
  }, [fetchPosition, fetchAstronautsData]);

  // Polling interval — clean up on unmount
  useEffect(() => {
    const id = setInterval(fetchPosition, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchPosition]);

  // Clean up geocode timeout on unmount
  useEffect(() => {
    return () => clearTimeout(geocodeTimeoutRef.current);
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchPosition();
  }, [fetchPosition]);

  return { position, positions, speed, speedHistory, nearestPlace, astronauts, isLoading, error, refresh };
}
