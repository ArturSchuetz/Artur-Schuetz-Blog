import Link from "next/link";

import { getTutorialCategories, TutorialCategory } from "@/app/_services/tutorial-category.service";

export default async function Categories() {
  const categories : TutorialCategory[] | null = await getTutorialCategories();

  return (
    <section className="categories">
      <h2 className="aside-blocks-title">Categories</h2>
      <ul>
        {categories?.map((category) => (
          <li key={category.id}>
            <Link
              href={`/tutorials/${category.slug}`}
              title={`${category.name} Tutorials`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
