import Link from "next/link";
import { wpFetch } from "@/lib/wp";

export const dynamic = "force-static";

type WPPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
};

async function getProjectsParentId() {
  const pages = await wpFetch<any[]>(`/wp-json/wp/v2/pages?slug=projects`);
  const parent = pages[0];
  return parent?.id as number | undefined;
}

async function getProjectChildren(parentId: number) {
  // menu_order works great for ordering child pages in WP
  return wpFetch<WPPage[]>(
    `/wp-json/wp/v2/pages?parent=${parentId}&per_page=100&orderby=menu_order&order=asc`
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default async function ProjectsIndexPage() {
  const parentId = await getProjectsParentId();

  if (!parentId) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Projects</h1>
        <p>
          Create a WordPress page with slug <code>projects</code> (you already did),
          then add child pages under it for each project.
        </p>
      </main>
    );
  }

  const projects = await getProjectChildren(parentId);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Projects</h1>

      {projects.length === 0 ? (
        <p>
          Add child pages under <code>Projects</code> in WordPress to populate this list.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {projects.map((p) => {
            const excerptText = p.excerpt?.rendered
              ? stripHtml(p.excerpt.rendered)
              : "";

            return (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                style={{
                  display: "block",
                  border: "1px solid #e5e5e5",
                  borderRadius: 10,
                  padding: 16,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}
                  dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                />
                {excerptText ? (
                  <div style={{ color: "#555" }}>{excerptText}</div>
                ) : (
                  <div style={{ color: "#555" }}>
                    (Add an excerpt in WordPress if you want a short summary here.)
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
