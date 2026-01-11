const wpUrl = process.env.WP_URL;
if (!wpUrl) throw new Error("WP_URL is not defined");

export async function wpFetch<T>(path: string): Promise<T> {
  const url = `${wpUrl}${path}`;
  const res = await fetch(url, {
    // no CF Access headers
    cache: "force-cache",
  });

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const body = await res.text();
    throw new Error(
      `WP fetch returned non-JSON.\nURL: ${url}\nStatus: ${res.status}\nContent-Type: ${contentType}\nBody preview: ${body.slice(0, 200)}`
    );
  }

  return res.json() as Promise<T>;
}
