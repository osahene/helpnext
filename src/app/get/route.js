import { NextResponse } from "next/server";

const IOS = "https://apps.apple.com/app/id6827770694";
const ANDROID = "https://play.google.com/store/apps/details?id=com.helpoohelp.helpflutter";
const WEB = process.env.NEXT_PUBLIC_SITE_URL || "https://helpoohelp.com";

export function GET(req) {
  const ua = req.headers.get("user-agent") ?? "";
  const platform = /iPhone|iPad|iPod/i.test(ua)
    ? "ios"
    : /Android/i.test(ua)
    ? "android"
    : "web";
  const src = req.nextUrl.searchParams.get("s") ?? "direct";

  console.log(JSON.stringify({ evt: "qr_scan", src, platform }));

  const to = platform === "ios" ? IOS : platform === "android" ? ANDROID : WEB;
  const res = NextResponse.redirect(to, 302);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
