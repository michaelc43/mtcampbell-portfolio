type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function wpFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const wpUrl = process.env.WP_URL;
  if (!wpUrl) throw new Error("WP_URL is not defined");

  // Use a plain object so TypeScript allows custom header keys
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  // Add Cloudflare Access service token headers when available (CI)
  const cfId = process.env.CF_ACCESS_CLIENT_ID;
  const cfSecret = process.env.CF_ACCESS_CLIENT_SECRET;

  if (cfId && cfSecret) {
    headers["CF-Access-Client-Id"] = cfId;
    headers["CF-Access-Client-Secret"] = cfSecret;
  }

  const res = await fetch(`${wpUrl}${path}`, {
    ...options,
    headers,
    cache: "force-cache", // static export friendly
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP fetch failed ${res.status}: ${text}`);
  }

  return res.json();
}
