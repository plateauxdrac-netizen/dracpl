import { ArrowRight, MapPin } from "lucide-react";
import { mapsEmbedUrl, officeLocation } from "@/lib/portal/location";

// Referrer-restricted browser key, safe to embed in the page. Bracket access
// because the project keeps noPropertyAccessFromIndexSignature enabled.
const browserKey = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];

function embedUrl(): string {
  return mapsEmbedUrl(browserKey);
}

export function OfficeMap() {
  const src = embedUrl();
  return (
    <div className="map-card">
      {src ? (
        <iframe
          className="map-frame"
          title={`Localisation de la Direction régionale des arts et de la culture à ${officeLocation.locality}`}
          src={src}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className="map-placeholder">
          <MapPin className="mx-auto mb-3" aria-hidden />
          <p className="text-sm text-muted-foreground">
            La carte interactive s’affiche une fois la clé Google Maps connectée à ce projet.
          </p>
        </div>
      )}
      <div className="map-meta">
        <div>
          <p className="font-medium">
            {officeLocation.locality} — {officeLocation.prefecture}
          </p>
          <p className="text-xs text-muted-foreground">
            {officeLocation.region} · {officeLocation.country} · Code plus :{" "}
            {officeLocation.plusCode}
          </p>
        </div>
        <a
          href={officeLocation.sharedLink}
          target="_blank"
          rel="noreferrer"
          className="section-link"
        >
          Ouvrir dans Google Maps <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
