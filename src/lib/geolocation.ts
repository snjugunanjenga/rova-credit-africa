// Browser geolocation + free OpenStreetMap Nominatim reverse geocoding.
// No API key needed. Respects user denial gracefully.

export interface GeoFix {
  latitude: number;
  longitude: number;
  label?: string;
}

export function getBrowserPosition(timeoutMs = 8000): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not available"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: timeoutMs },
    );
  });
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | undefined> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12&addressdetails=1`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return undefined;
    const data: { display_name?: string; address?: Record<string, string> } = await res.json();
    const a = data.address ?? {};
    const town = a.suburb || a.neighbourhood || a.village || a.town || a.city || a.county;
    const region = a.state || a.region || a.country;
    if (town && region) return `${town}, ${region}`;
    return data.display_name?.split(",").slice(0, 2).join(",").trim();
  } catch {
    return undefined;
  }
}

export async function detectLocation(): Promise<GeoFix | null> {
  try {
    const pos = await getBrowserPosition();
    const label = await reverseGeocode(pos.latitude, pos.longitude);
    return { latitude: pos.latitude, longitude: pos.longitude, label };
  } catch {
    return null;
  }
}
