type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function wpFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const wpUrl = process.env.WP_URL;
  if (!wpUrl) throw new Error("WP_URL is not defined");
  if (cfId && cfSecret) {
   console.log("wpFetch: Cloudflare Access headers enabled");
  } else {
   console.log("wpFetch: Cloudflare Access headers NOT enabled");
  }


  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(options.headers ?? {}),
  };

  const cfId = process.env.CF_ACCESS_CLIENT_ID;
  const cfSecret = process.env.CF_ACCESS_CLIENT_SECRET;
  if (cfId && cfSecret) {
    headers["CF-Access-Client-Id"] = cfId;
    headers["CF-Access-Client-Secret"] = cfSecret;
  }

  const url = `${wpUrl}${path}`;
  const res = await fetch(url, { ...options, headers, cache: "force-cache" });

  const contentType = res.headers.get("content-type") ?? "";
  const bodyText = await res.text();

  // If Cloudflare Access/login page comes back, it will be HTML
  if (contentType.includes("text/html") || bodyText.startsWith("<!DOCTYPE")) {
    throw new Error(
      `WP fetch returned HTML instead of JSON.\n` +
      `URL: ${url}\n` +
      `Status: ${res.status}\n` +
      `Content-Type: ${contentType}\n` +
      `Body preview: ${bodyText.slice(0, 200)}`
    );
  }

  if (!res.ok) {
    throw new Error(`WP fetch failed ${res.status}.\nURL: ${url}\nBody: ${bodyText.slice(0, 200)}`);
  }

  return JSON.parse(bodyText) as T;
}
