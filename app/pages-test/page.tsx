export const dynamic = "force-static";

type WPPage = {
  id: number;
  title: { rendered: string };
  link: string;
  slug: string;
};

export default async function PagesTest() {
  const wpUrl = process.env.WP_URL;

  if (!wpUrl) {
    return (
      <main style={{ padding: 24 }}>
        <h1>WP_URL not set</h1>
        <p>Create a .env.local with WP_URL=http://localhost:8080</p>
      </main>
    );
  }

  const res = await fetch(`${wpUrl}/wp-json/wp/v2/pages?per_page=20`, {
  cache: "force-cache",
});


  if (!res.ok) {
    const text = await res.text();
    return (
      <main style={{ padding: 24 }}>
        <h1>Failed to fetch WordPress pages</h1>
        <p>Status: {res.status}</p>
        <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
        <p>URL: {wpUrl}/wp-json/wp/v2/pages</p>
      </main>
    );
  }

  const pages: WPPage[] = await res.json();

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
