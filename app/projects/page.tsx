import Link from "next/link";
import { wpFetch } from "@/lib/wp";

export const dynamic = "force-static";

type WPPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  content?: { rendered: string };
  excerpt?: { rendered: string };
};

async function getProjectsParent() {
  const pages = await wpFetch<WPPage[]>(`/wp-json/wp/v2/pages?slug=projects`);
  return pages[0] ?? null;
}

async function getProjectChildren(parentId: number) {
  return wpFetch<WPPage[]>(
    `/wp-json/wp/v2/pages?parent=${parentId}&per_page=100&orderby=menu_order&order=asc`
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default async function ProjectsIndexPage() {
  const parent = await getProjectsParent();

  if (!parent) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Projects</h1>
        <p>
          Create a WordPress page with slug <code>projects</code>, then add child
          pages under it for each project.
        </p>
      </main>
    );
  }

  const projects = await getProjectChildren(parent.id);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      {/* Render WP-controlled content FIRST */}
      <div
        className="wp-content"
        dangerouslySetInnerHTML={{
          __html: parent.content?.rendered ?? "",
        }}
      />

      {/* Cards AFTER the WP content */}
      {projects.length === 0 ? (
        <p style={{ marginTop: 16 }}>
          Add child pages under <code>Projects</code> in WordPress to populate this list.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
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
                <div
                  style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}
                  dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                />

                <div
                  style={{
                    color: "#555",
                    display: "-webkit-box",
                    WebkitLineClamp: 6, // 5–10 is typical
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {excerptText || "(Add an excerpt in WordPress for a short summary.)"}
                </div>

                <div
                  style={{
                    marginTop: 12,
                    fontWeight: 700,
                  }}
                >
                  More details →
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
