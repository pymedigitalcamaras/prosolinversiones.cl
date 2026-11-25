export function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";
  return origin === `${protocol}://${host}`;
}
