import { notFound } from "next/navigation";
import { wpFetch } from "@/lib/wp";

export const dynamic = "force-static";

type WPPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
};

async function getProjectsParentId() {
  const parent = await wpFetch<WPPage[]>(`/wp-json/wp/v2/pages?slug=projects&per_page=1`);
  return parent[0]?.id;
}

export async function generateStaticParams() {
  const parentId = await getProjectsParentId();
  if (!parentId) return [];

  const children = await wpFetch<WPPage[]>(
    `/wp-json/wp/v2/pages?parent=${parentId}&per_page=100`
  );

  console.log("projects parentId:", parentId);
  console.log("projects slugs:", children.map((c) => c.slug));

  return children.map((p) => ({ slug: p.slug }));
}

async function getProjectBySlug(slug: string) {
  const parentId = await getProjectsParentId();
  if (!parentId) return null;

  const pages = await wpFetch<WPPage[]>(
    `/wp-json/wp/v2/pages?parent=${parentId}&slug=${slug}&per_page=1`
  );

  console.log("detail lookup:", { slug, parentId, count: pages.length });
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
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div
        className="wp-content"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </main>
  );
}
