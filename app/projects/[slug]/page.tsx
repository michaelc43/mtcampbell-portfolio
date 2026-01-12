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
    const parent = await wpFetch<any[]>(`/wp-json/wp/v2/pages?slug=projects`);
    return parent[0]?.id as number | undefined;
  }
  
  async function getProjectBySlug(slug: string) {
    const parentId = await getProjectsParentId();
    if (!parentId) return null;
  
    // Constrain to children of Projects
    const pages = await wpFetch<WPPage[]>(
      `/wp-json/wp/v2/pages?slug=${slug}&parent=${parentId}&per_page=1`
    );
  
    console.log("detail lookup slug:", slug, "parent:", parentId, "count:", pages.length);
    return pages[0] ?? null;
  }
  
  

async function getProjectChildren(parentId: number) {
  return wpFetch<WPPage[]>(
    `/wp-json/wp/v2/pages?parent=${parentId}&per_page=100&orderby=menu_order&order=asc`
  );
}

export async function generateStaticParams() {
  const parentId = await getProjectsParentId();
  if (!parentId) return [];

  const children = await getProjectChildren(parentId);
  return children.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const parentId = await getProjectsParentId();
  if (!parentId) notFound();

  const children = await getProjectChildren(parentId);
  const page = children.find((p) => p.slug === params.slug) ?? null;

  if (!page) {
    console.log("Project not found at build time:", params.slug);
    notFound();
  } 

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </main>
  );
}
