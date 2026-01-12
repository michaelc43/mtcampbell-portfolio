import { notFound } from "next/navigation";
import { wpFetch } from "@/lib/wp";
import Link from "next/link";

export const dynamic = "force-static";
export const dynamicParams = false;

type WPPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
};

async function getProjectsParentId() {
  const parent = await wpFetch<WPPage[]>(
    `/wp-json/wp/v2/pages?slug=projects&per_page=1`
  );
  return parent[0]?.id;
}

async function getProjectChildren(parentId: number) {
  return wpFetch<WPPage[]>(
    `/wp-json/wp/v2/pages?parent=${parentId}&per_page=100`
  );
}

export async function generateStaticParams() {
  const parentId = await getProjectsParentId();
  if (!parentId) return [];

  const children = await getProjectChildren(parentId);

  console.log("generateStaticParams parentId:", parentId);
  console.log("generateStaticParams slugs:", children.map((c) => c.slug));

  return children.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  // Works whether Next gives params as an object or a Promise
  const resolvedParams = typeof (params as any)?.then === "function"
    ? await (params as Promise<{ slug: string }>)
    : (params as { slug: string });

  const slug = resolvedParams?.slug;

  console.log("ProjectDetailPage slug:", slug);

  if (!slug) notFound();

  const parentId = await getProjectsParentId();
  if (!parentId) notFound();

  const children = await getProjectChildren(parentId);

  console.log("ProjectDetailPage children slugs:", children.map((c) => c.slug));

  const page = children.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      
      {/* Back link */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/projects"
          style={{
            textDecoration: "none",
            fontWeight: 500,
            color: "#555",
          }}
        >
          ← Back to Projects
        </Link>
      </div>

      <div
        className="wp-content"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </main>
  );
}
