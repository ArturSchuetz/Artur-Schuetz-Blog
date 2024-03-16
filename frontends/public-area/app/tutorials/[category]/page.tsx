
import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";
import Image from "next/image";
import Link from "next/link";

import {
  getTutorialCategories,
} from "@/app/_services/tutorial-category.service";
import { getTutorialTopics, TutorialTopic } from "@/app/_services/tutorial-topic.service";
import { getTutorialChapters, TutorialChapter } from "@/app/_services/tutorial-chapter.service";

function createSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  let activeCategory = params.category || "all";
  let filteredItems: TutorialTopic[] | null;

  const tutorialTopics = (await getTutorialTopics()).flat();
  if (activeCategory !== "all" && tutorialTopics) {
    filteredItems = tutorialTopics.filter((topic) => topic.category?.slug === activeCategory);
  } else {
    filteredItems = tutorialTopics;
  }

  let tutorialCategories = await getTutorialCategories();

  // ===================

  const chapters: TutorialChapter[] | null = await getTutorialChapters();

  let _category = "";
  let page_title = "Tutorials";
  if (activeCategory !== "all" && tutorialTopics) {
    filteredItems = tutorialTopics.filter((topic) => topic.category?.slug === activeCategory);
    if (filteredItems.length > 0) {
      page_title = filteredItems[0].category?.name + " " + page_title;
      _category = filteredItems[0].category?.name + "";
    }
  }
  const site_description = "Explore my tutorials" + (activeCategory !== "all" ? " on " + _category : "") + ". Whether you're starting out or looking to deepen your understanding, you'll find valuable insights and hands-on guidance.";

  const keywords: string = tutorialCategories.map((category) => category.name).join(', ');
  const canonical_site_url = '/tutorials/' + activeCategory;

  let openGraph_images: any = [];
  let openGraph_videos: any = [];
  let twitter_images: any[] = [];

  if (filteredItems) {
    filteredItems.forEach(topic => {
      if (topic.imageId) {
        openGraph_images.push({
          url: `${getConfig().apiUrl}/medias/${topic.imageId
            }`, alt: topic.name
        });
        twitter_images.push({
          url: new URL(`${getConfig().apiUrl}/medias/${topic.imageId
            }`), alt: topic.name
        });
      }
    });
  }

  let tags = "";
  chapters?.filter((chapter) => chapter.articles?.filter((article) => article.isPublished) != null ? chapter.articles?.filter((article) => article.isPublished).length > 0 : false).sort((a, b) => a.position - b.position).map((chapter) => {
    chapter?.articles?.filter((article) => article.isPublished).map((article) => {

      tags += "," + article.tags;
      if (article.previewMediaId != null) {
        openGraph_images.push({
          url: `${getConfig().apiUrl}/medias/${article.previewMediaId
            }`, alt: article.title
        });
        twitter_images.push({
          url: new URL(`${getConfig().apiUrl}/medias/${article.previewMediaId
            }`), alt: article.title
        });
      }

      if (article.previewHostedVideoUrl != null) {
        openGraph_videos.push({ url: article.previewHostedVideoUrl });
      }
    })
  });
  
  let tagsArray: string[] = tags.split(',').map(tag => tag.trim());
  let uniqueTagsArray = Array.from(new Set(tagsArray));
  tags = uniqueTagsArray.join(', ');

  return {
    title: page_title + ' | ' + siteConfig.site.title,
    description: site_description,
    keywords: keywords + (tags.length > 0 ? tags : ""),
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
    category: activeCategory !== "all" ? _category : null,
  }
}

export default async function Tutorials({
  params,
}: {
  params: { category: string };
}) {
  let activeCategory = params.category || "all";
  let filteredItems: TutorialTopic[] | null;

  const tutorialTopics = (await getTutorialTopics()).flat();
  if (activeCategory !== "all" && tutorialTopics) {
    filteredItems = tutorialTopics.filter((topic) => topic.category?.slug === activeCategory);
  } else {
    filteredItems = tutorialTopics;
  }

  let tutorialsCategories = await getTutorialCategories();

  return (
    <main>
      {tutorialTopics && (
        <div className="container">
          <div className="category-title d-flex align-items-center justify-content-between">
            <h1 className="h1">Tutorials</h1>
            <div>
              <span className="portfolio-amount-items"></span>
              <span>{tutorialTopics.length} Topics</span>
            </div>
          </div>
          <nav className="portfolio-menu menu-filter">
            <ul className="d-flex flex-wrap flex-md-nowrap">
              <li className={activeCategory === "all" ? "active" : ""}>
                <Link href={`/tutorials/all`} data-filter="all" title="All">
                  All
                </Link>
              </li>
              {tutorialsCategories?.map((category) => (
                <li
                  key={category.name}
                  className={
                    activeCategory ===
                      category.slug
                      ? "active"
                      : ""
                  }
                >
                  <Link
                    href={`/tutorials/${category.slug}`}
                    data-filter={category.slug}
                    title={category.name}
                  >
                    {category.name}
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
            {filteredItems?.map((topic) => (
              <div
                key={topic.id}
                className="portfolio-item filter-item white-box"
                data-filter={topic.slug}
              >
                <div
                  className={`portfolio-item-wrapper ${"filter-item-default"} d-flex flex-column flex-lg-row`}
                  style={{ background: undefined }}
                >
                  <div className="filter-item-wrapper-left">
                    <div className="d-flex align-items-md-center flex-column flex-md-row">
                      <Link href={`/tutorials/topic/${topic.slug}`}>
                        <h2>Learn <span className="fw-900">{topic.name}</span></h2>
                      </Link>
                      <span className="filter-item-category">
                        {topic.category?.name}
                      </span>
                    </div>
                    <p className="filter-item-text">{topic.description}</p>
                    {topic.slug && (
                      <Link href={`/tutorials/topic/${topic.slug}`} className="btn">
                        Go to Tutorials
                      </Link>
                    )}
                  </div>
                  {topic.imageId && (
                    <div className="filter-item-wrapper-right d-flex align-items-end justify-content-center">
                      <Link href={`/tutorials/topic/${topic.slug}`}>
                        <Image
                          className="img-fluid"
                          src={`${getConfig().apiUrl}/medias/${topic.imageId
                            }`}
                          alt={topic.name}
                          width={500}
                          height={500}
                          style={{
                            width: "auto",
                            height: "267px",
                          }}
                        />
                      </Link>
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
