import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhook(.*)",
  "/api/generate-image(.*)",
  "/api/remove-background(.*)",
  "/api/image-cleanup(.*)",
  "/api/images(.*)", // 画像管理APIを追加
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/api/webhook")) {
    return;
  }

  if (isPublicRoute(req)) {
    return;
  }

  await auth.protect();
});

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/api/webhook(.*)",
    "/api/(.*)",
    "/sso-callback(.*)",
    "/(sign-in|sign-up)(.*)",
  ],
};
