import Link from "next/link";

import { getBlogCategories, BlogCategory } from "@/app/_services/blog-category.service";

export default async function Categories() {
  const categories : BlogCategory[] | null = await getBlogCategories();

  return (
    <section className="categories">
      <h2 className="aside-blocks-title">Categories</h2>
      <ul>
        {categories?.map((category) => (
          <li key={category.id} className={`nav-elipse-${category.color}`}>
            <Link
              href={`/blog/category/${category.slug}/page/1`}
              title={`${category.name} Blog Articles`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
