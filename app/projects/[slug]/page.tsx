import { notFound } from "next/navigation";
import { wpFetch } from "@/lib/wp";

export const dynamic = "force-static";

type WPPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
};

export async function generateStaticParams() {
  // Find the parent "projects" page
  const parent = await wpFetch<any[]>(`/wp-json/wp/v2/pages?slug=projects`);
  const parentId = parent[0]?.id;

  if (!parentId) return [];

  // Get child pages (projects)
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

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div
        className="wp-content"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </main>
  );
}
