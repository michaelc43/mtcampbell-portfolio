import Link from "next/link";
import { notFound } from "next/navigation";
import { wpFetch } from "@/lib/wp";

export const dynamic = "force-static";

type WPPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export async function generateStaticParams() {
  const parent = await wpFetch<any[]>(`/wp-json/wp/v2/pages?slug=projects`);
  const parentId = parent[0]?.id;
  if (!parentId) return [];

  const children = await wpFetch<WPPage[]>(
    `/wp-json/wp/v2/pages?parent=${parentId}&per_page=100`
  );

  return children.map((p) => ({ slug: p.slug }));
}

async function getProjectBySlug(slug: string) {
  const pages = await wpFetch<WPPage[]>(`/wp-json/wp/v2/pages?slug=${slug}`);
  return pages[0] ?? null;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = await getProjectBySlug(params.slug);
  if (!page) notFound();

  const excerptText = page.excerpt?.rendered
    ? stripHtml(page.excerpt.rendered)
    : "";

  return (
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <Link
            href="/projects/"
            style={{ textDecoration: "underline", color: "inherit" }}
          >
            ← Back to Projects
          </Link>
        </div>

        <header style={{ marginBottom: 18 }}>
          <h1
            style={{ margin: "0 0 8px 0" }}
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />
          {excerptText ? (
            <p style={{ margin: 0, color: "#555" }}>{excerptText}</p>
          ) : null}
        </header>

        <div
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </div>
    </main>
  );
}
