type FetchOptions = RequestInit & {
  revalidate?: number;
}; 

export async function wpFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const wpUrl = process.env.WP_URL;

  if (!wpUrl) {
    throw new Error("WP_URL is not defined");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Only add Cloudflare Access headers in CI / production
  if (
    process.env.CF_ACCESS_CLIENT_ID &&
    process.env.CF_ACCESS_CLIENT_SECRET
  ) {
    headers["CF-Access-Client-Id"] =
      process.env.CF_ACCESS_CLIENT_ID;
    headers["CF-Access-Client-Secret"] =
      process.env.CF_ACCESS_CLIENT_SECRET;
  }

  const res = await fetch(`${wpUrl}${path}`, {
    ...options,
    headers,
    cache: "force-cache", // static export friendly
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `WP fetch failed ${res.status}: ${text}`
    );
  }

  return res.json();
}
