// Browser-safe module: shared location data for the portal.
// Coordinates come from the Google Maps link shared by the Direction
// (https://maps.app.goo.gl/bc21ccoVj1tK57dNA). The locality, prefecture and
// region below were read back from the Google Geocoding API for those
// coordinates, not written from memory.
export const officeLocation = {
  latitude: 7.521079,
  longitude: 1.141057,
  zoom: 16,
  locality: "Atakpamé",
  prefecture: "Préfecture de l'Ogou",
  region: "Région des Plateaux",
  country: "Togo",
  plusCode: "G4CR+CC Atakpamé",
  sharedLink: "https://maps.app.goo.gl/bc21ccoVj1tK57dNA",
} as const;

export function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Builds the Google Maps Embed API address for the shared location.
// Returns an empty string when no browser key is configured, so the page can
// fall back to a plain link instead of loading a map Google will refuse.
export function mapsEmbedUrl(browserKey: string | undefined): string {
  const key = typeof browserKey === "string" ? browserKey.trim() : "";
  if (!key) return "";
  const params = new URLSearchParams({
    key,
    q: `${officeLocation.latitude},${officeLocation.longitude}`,
    zoom: String(officeLocation.zoom),
    language: "fr",
    region: "TG",
  });
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}
