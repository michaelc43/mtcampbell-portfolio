export const dynamic = "force-static";

import { wpFetch } from "@/lib/wp";

type WPPage = {
  id: number;
  title: { rendered: string };
  slug: string;
};

export default async function PagesTest() {
  const pages = await wpFetch<WPPage[]>(
    `/wp-json/wp/v2/pages?per_page=20`
  );

  return (
    <main style={{ padding: 24 }}>
      <h1>WordPress Pages</h1>
      <ul>
        {pages.map((p) => (
          <li key={p.id}>
            <strong dangerouslySetInnerHTML={{ __html: p.title.rendered }} />{" "}
            <span style={{ opacity: 0.7 }}>({p.slug})</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
