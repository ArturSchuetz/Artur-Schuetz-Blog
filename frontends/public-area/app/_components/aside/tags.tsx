import Link from "next/link";

export default function Tags({ tags }: { tags: string[] | null }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <section className="tags">
      <h2 className="aside-blocks-title">Tags</h2>
      <ul className="tags-content">
        {tags.map((tag, index) => (
          <li key={index} className="badge rounded-pill">
            <Link href="#">
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
