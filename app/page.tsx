export const dynamic = "force-static";

type WPPage = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
};

async function getPageBySlug(slug: string) {
  const wpUrl = process.env.WP_URL!;
  import { wpFetch } from "@/lib/wp";

const page = await wpFetch<any[]>(
  `/wp-json/wp/v2/pages?slug=about`
);

const data = page[0];

  if (!res.ok) throw new Error(`Failed to fetch page ${slug}: ${res.status}`);
  const arr: WPPage[] = await res.json();
  return arr[0] ?? null;
}

export default async function Home() {
  const page = await getPageBySlug("home");

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 dangerouslySetInnerHTML={{ __html: page?.title.rendered ?? "Home" }} />
      {page ? (
        <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      ) : (
        <p>Create a WordPress page with slug <code>home</code> and publish it.</p>
      )}
    </main>
  );
}
