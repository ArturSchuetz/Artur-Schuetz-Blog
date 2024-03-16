import Link from "next/link";

export default function LastProject() {
  return (
    <section className="last-project">
      <h2 className="aside-blocks-title">Last Project</h2>
      <div className="last-project-one">
        <h3 className="h4">
          <Link href="#">Microsoft TypeScript</Link>
        </h3>
        <time dateTime="2022-12-31T23:59:59Z">January 18, 2022</time>
        <p className="mt-2 last-project-one-text">
          TypeScript starts from the same syntax and semantics that millions of
          JavaScript developers know...{" "}
        </p>
        <Link href="#" title="Watch it" className="btn btn-small">
          Watch it
        </Link>
      </div>
    </section>
  );
}
