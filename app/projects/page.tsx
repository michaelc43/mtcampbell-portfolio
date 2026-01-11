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

export default async function ProjectsPage() {
  const page = await getPageBySlug("projects");

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      {page ? (
        <div
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      ) : (
        <p>
          Create and publish a WordPress page with slug <code>projects</code>.
        </p>
      )}
    </main>
  );
}
