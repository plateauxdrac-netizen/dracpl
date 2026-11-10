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
});
