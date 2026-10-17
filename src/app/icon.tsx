import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#356DF3", borderRadius: 14 }}>
        <svg width="64" height="64" viewBox="0 0 32 32">
          <path d="M7.5 24V15.5a8.5 8.5 0 0 1 17 0V24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M12.5 24v-8a3.5 3.5 0 0 1 7 0v8" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
