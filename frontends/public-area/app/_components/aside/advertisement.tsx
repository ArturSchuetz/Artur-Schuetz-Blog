import Image from "next/image";
import Link from "next/link";

export default function Advertisement() {
  return (
    <section className="advertisement">
      <Link href="#">
        <Image
          src="/img/webp/advertisement_2x.webp"
          alt="Advertisement"
          width={284}
          height={337}
        />
      </Link>
    </section>
  );
}
