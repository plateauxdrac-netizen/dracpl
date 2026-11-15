import { describe, expect, it } from "vitest";
import { mapsEmbedUrl } from "@/lib/portal/location";

describe("Google Maps embed for the contact page", () => {
  it("points the embed at the location shared by the Direction", () => {
    const url = new URL(mapsEmbedUrl("demo-browser-key"));
    expect(`${url.origin}${url.pathname}`).toBe("https://www.google.com/maps/embed/v1/place");
    expect(url.searchParams.get("q")).toBe("7.521079,1.141057");
    expect(url.searchParams.get("zoom")).toBe("16");
    expect(url.searchParams.get("language")).toBe("fr");
  });

  it("asks for no Google request when no browser key is configured", () => {
    expect(mapsEmbedUrl(undefined)).toBe("");
    expect(mapsEmbedUrl("   ")).toBe("");
  });

  it("uses the plain map link locally instead of an unauthorized Google embed", () => {
    expect(mapsEmbedUrl("demo-browser-key", "localhost")).toBe("");
    expect(mapsEmbedUrl("demo-browser-key", "127.0.0.1")).toBe("");
    expect(mapsEmbedUrl("demo-browser-key", "dracpl.lovable.app")).toContain("google.com/maps");
  });
});
