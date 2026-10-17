import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.brand} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 72, color: "#fff", background: "linear-gradient(135deg, #0B1220 0%, #16275a 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 72, height: 72, borderRadius: 18, background: "#356DF3" }}>
            <svg width="72" height="72" viewBox="0 0 32 32">
              <path d="M7.5 24V15.5a8.5 8.5 0 0 1 17 0V24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              <path d="M12.5 24v-8a3.5 3.5 0 0 1 7 0v8" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: -1 }}>Bridgecodes</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 950 }}>
            {site.tagline}
          </div>
          <div style={{ fontSize: 30, color: "#9bb8ff" }}>{`Software products and digital solutions by ${site.legalOwner}`}</div>
        </div>
      </div>
    ),
    size,
  );
}
