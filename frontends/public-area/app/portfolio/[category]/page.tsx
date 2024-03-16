
import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";
import Image from "next/image";
import Link from "next/link";

import {
  getProjects,
  getProjectCategories,
  Project,
} from "@/app/_services/project.service";

function createSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  const page_title = siteConfig.author.name + "'s Project Portfolio";
  const site_description = 'Gain insights into Artur Schütz’s diverse range of software development projects. This page covers various areas including 3D rendering, machine learning, and web development, showcasing a blend of technical proficiency and creative solutions.'

  let activeCategory = params.category || "all";
  let filteredItems: Project[] | null;

  const projects = await getProjects();
  if (activeCategory !== "all" && projects) {
    filteredItems = 
      projects.filter(
        (item) =>
        createSlug(item.category) === activeCategory
      );
  } else {
    filteredItems = projects;
  }

  let projectCategories = await getProjectCategories();
  const keywords: string = projectCategories.join(', ');
  const canonical_site_url = '/portfolio/' + activeCategory;

  let openGraph_images: any = [];
  let twitter_images: any[] = [];
  if (filteredItems) {
    filteredItems.forEach(project => {
      if (project.imageMediaId) {
        openGraph_images.push({ url: `${getConfig().apiUrl}/medias/${
          project.imageMediaId
        }`, alt: project.title });
        twitter_images.push({ url: new URL(`${getConfig().apiUrl}/medias/${
          project.imageMediaId
        }`), alt: project.title });
      }
    });
  }

  return {
    title: page_title + ' | ' + siteConfig.site.title,
    description: site_description,
    keywords: 'project, projects, portfolio, artur, schütz, '+ keywords,
    alternates: { canonical: canonical_site_url },
    openGraph: {
      type: 'website',
      determiner: 'auto',
      title: page_title,
      description: site_description,
      siteName: siteConfig.site.title,
      locale: 'en_US',
      images: openGraph_images.length > 0 ? openGraph_images : null,
      url: getConfig().baseUrl + canonical_site_url,
    },
    twitter: {
      card: twitter_images.length > 0 ? 'summary_large_image' : 'summary',
      site: siteConfig.site.twitter_site,
      creator: siteConfig.site.twitter_creator,
      title: page_title,
      description: site_description,
      images: twitter_images.length > 0 ? twitter_images : null
    },
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
      url: false
    },
    category: activeCategory,
  }
}

export default async function Portfolio({
  params,
}: {
  params: { category: string };
}) {
  let activeCategory = params.category || "all";
  let filteredItems: Project[] | null;

  const projects = await getProjects();
  if (activeCategory !== "all" && projects) {
    filteredItems = 
      projects.filter(
        (item) =>
        createSlug(item.category) === activeCategory
      );
  } else {
    filteredItems = projects;
  }

  let projectCategories = await getProjectCategories();

  return (
      <main>
        {projects && (
          <div className="container">
            <div className="category-title d-flex align-items-center justify-content-between">
              <h1 className="h1">Portfolio</h1>
              <div>
                <span className="portfolio-amount-items"></span>
                <span>{projects.length} Projects</span>
              </div>
            </div>
            <nav className="portfolio-menu menu-filter">
              <ul className="d-flex flex-wrap flex-md-nowrap">
                <li className={activeCategory === "all" ? "active" : ""}>
                  <Link href={`/portfolio/all`} data-filter="all" title="All">
                    All
                  </Link>
                </li>
                {projectCategories?.map((category) => (
                  <li
                    key={category}
                    className={
                      activeCategory ===
                      createSlug(category)
                        ? "active"
                        : ""
                    }
                  >
                    <Link
                      href={`/portfolio/${createSlug(category)}`}
                      data-filter={createSlug(category)}
                      title={category}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="portfolio">
              <p className="portfolio-empty filter-empty d-flex align-items-center d-none">
                <i className="pe-7s-attention"></i>
                No items at this category. Sorry!
              </p>
              {filteredItems?.map((project) => (
                <div
                  key={project.id}
                  className="portfolio-item filter-item white-box"
                  data-filter={createSlug(project.category)}
                >
                  <div
                    className={`portfolio-item-wrapper ${
                      project.background && project.background !== "#ffffff"
                        ? ""
                        : "filter-item-default"
                    } d-flex flex-column flex-lg-row`}
                    style={{
                      background:
                        project.background && project.background !== "#ffffff"
                          ? project.background
                          : undefined,
                    }}
                  >
                    <div className="filter-item-wrapper-left">
                      <div className="d-flex align-items-md-center flex-column flex-md-row">
                        <h2 className="fw-900">{project.title}</h2>
                        <span className="filter-item-category">
                          {project.category}
                        </span>
                      </div>
                      <p className="filter-item-text">{project.text}</p>
                      {project.link && (
                        <Link href={project.link} className="btn">
                          Read more
                        </Link>
                      )}
                    </div>
                    {project.imageMediaId && (
                      <div className="filter-item-wrapper-right d-flex align-items-end justify-content-center">
                        <Image
                          className="img-fluid"
                          src={`${getConfig().apiUrl}/medias/${
                            project.imageMediaId
                          }`}
                          alt={project.title}
                          width={500}
                          height={500}
                          style={{
                            width: "auto",
                            height: "267px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
  );
}
