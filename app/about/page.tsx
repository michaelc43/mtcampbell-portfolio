import { wpFetch } from "@/lib/wp";

export const dynamic = "force-static";

type WPPage = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
};

async function getPageBySlug(slug: string) {
  const pages = await wpFetch<WPPage[]>(`/wp-json/wp/v2/pages?slug=${slug}`);
  return pages[0] ?? null;
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1
        dangerouslySetInnerHTML={{
          __html: page?.title.rendered ?? "About",
        }}
      />
      {page ? (
	<div className="wp-content" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      ) : (
        <p>
          Create and publish a WordPress page with slug <code>about</code>.
        </p>
      )}
    </main>
  );
}
