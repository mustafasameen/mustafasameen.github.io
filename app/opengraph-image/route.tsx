import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Mustafa Sameen";
    const subtitle = searchParams.get("title")
      ? "mustafasameen.com"
      : "PhD Student · University of Florida";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#09090b",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "48px",
              color: "#a1a1aa",
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            mustafasameen.com
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 48px",
              maxWidth: "1000px",
            }}
          >
            <h1
              style={{
                fontSize: "64px",
                fontWeight: 700,
                color: "#fafafa",
                lineHeight: 1.15,
                textAlign: "center",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <div
              style={{
                marginTop: "28px",
                height: "6px",
                width: "88px",
                borderRadius: "3px",
                backgroundColor: "#10b981",
              }}
            />
            <p
              style={{
                marginTop: "28px",
                fontSize: "26px",
                color: "#a1a1aa",
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
