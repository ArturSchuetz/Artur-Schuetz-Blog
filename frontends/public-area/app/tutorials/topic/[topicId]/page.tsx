import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";
import Link from "next/link";

import Author from "@/app/_components/aside/author";
import TutorialTopics from "@/app/_components/aside/tutorial-topics";

import { TutorialTopic, getTutorialTopic } from "@/app/_services/tutorial-topic.service";
import { TutorialChapter, getTutorialChaptersByTopic } from "@/app/_services/tutorial-chapter.service";
import { TutorialCategory, getTutorialCategories } from "@/app/_services/tutorial-category.service";

export async function generateMetadata({
  params,
}: {
  params: { topicId: number | string };
}) {
  const { topicId } = params;
  const topic: TutorialTopic | null = await getTutorialTopic(topicId);
  const chapters: TutorialChapter[] | null = await getTutorialChaptersByTopic(topic.id);
  let orderedChapters = chapters?.sort((a, b) => a.position - b.position) as TutorialChapter[];

  // ===================

  const page_title = topic?.name + " Tutorials";
  const site_description = topic?.description;

  let openGraph_images: any = [];
  let openGraph_videos: any = [];
  let twitter_images: any[] = [];

  if (topic.imageId != null) {
    openGraph_images.push({
      url: `${getConfig().apiUrl}/medias/${topic.imageId}`, alt: topic.name
    });

    twitter_images.push({
      url: new URL(`${getConfig().apiUrl}/medias/${topic.imageId}`), alt: topic.name
    });
  }

  let tags = "";
  orderedChapters?.filter((chapter) => chapter.articles?.filter((article) => article.isPublished) != null ? chapter.articles?.filter((article) => article.isPublished).length > 0 : false).sort((a, b) => a.position - b.position).map((chapter) => {
    chapter?.articles?.filter((article) => article.isPublished).map((article) => {
      tags += "," + article.tags;
    })

    if (chapter.imageId != null) {
      openGraph_images.push({
        url: `${getConfig().apiUrl}/medias/${chapter.imageId}`, alt: chapter.name
      });

      twitter_images.push({
        url: new URL(`${getConfig().apiUrl}/medias/${chapter.imageId}`), alt: chapter.name
      });
    }
  });

  let tagsArray: string[] = tags.split(',').map(tag => tag.trim());
  let uniqueTagsArray = Array.from(new Set(tagsArray));
  tags = uniqueTagsArray.join(', ');

  if (openGraph_images.length == 0 && twitter_images.length == 0) {
    openGraph_images.push({ url: getConfig().baseUrl + "/img/00066-4008645638.png", alt: siteConfig.author.name });
    twitter_images.push({ url: new URL(getConfig().baseUrl + "/img/00066-4008645638.png"), alt: siteConfig.author.name });
  }

  const categories: TutorialCategory[] = await getTutorialCategories();
  let categoriesStringArray: string[] = [];
  if (categories) {
    categories.forEach(category => {
      categoriesStringArray.push(category.name.toLocaleLowerCase());
    });
  }

  const keywords: string = categoriesStringArray.join(', ');
  const canonical_site_url = '/tutorials/topic/' + topic.slug;

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
    category: topic.category?.name
  }
}

export default async function TutorialTopicList({
  params,
}: {
  params: { topicId: number | string };
}) {
  const { topicId } = params;
  const topic: TutorialTopic | null = await getTutorialTopic(topicId);
  const chapters: TutorialChapter[] | null = await getTutorialChaptersByTopic(topic.id);
  let orderedChapters = chapters?.sort((a, b) => a.position - b.position) as TutorialChapter[];

  return (
    <main>
      <div className="container">
        {topic && (
          <div className="category-title d-flex align-items-center justify-content-between">
            <h1 className="h1">Learn {topic.name}</h1>
          </div>
        )}
        <div className="row">
          <div className="col-lg-8 col-xs-12">
            <section className="articles">
              {orderedChapters?.filter((chapter) => chapter.articles?.filter((article) => article.isPublished) != null ? chapter.articles?.filter((article) => article.isPublished).length > 0 : false).sort((a, b) => a.position - b.position).map((chapter) => (
                <article key={`articles_${chapter.id}`} className={`${topic?.color}-article`}>
                  {chapter.imageId && (
                    <img
                      className="img-fluid"
                      src={`${getConfig().apiUrl}/medias/${chapter.imageId}?w=696`}
                      alt={chapter.name}
                    />
                  )}
                  <div className="articles-header">
                    <h2>{chapter.name}</h2>
                    <ul>
                      {chapter?.articles?.filter((article) => article.isPublished).map((article) => (
                        <li key={article.id}>
                          <Link
                            href={`/tutorials/article/${article.slug}`}
                            title={`${article.title}`}
                          >
                            {article.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </section>
          </div>
          <div className="aside-blocks col-lg-4 col-xs-12">
            {/*
            {orderedChapters?.filter((chapter) => chapter.articles?.filter((article) => article.isPublished) != null ? chapter.articles?.filter((article) => article.isPublished).length > 0 : false).sort((a, b) => a.position - b.position).map((chapter) => (
              <section className="categories">
                <h2 className="aside-blocks-title">{chapter.name}</h2>
                <ul>
                  {chapter?.articles?.filter((article) => article.isPublished).map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/tutorials/article/${article.slug}`}
                        title={`${article.title}`}
                      >
                        {article.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            */}
            <Author />
            <TutorialTopics />
          </div>
        </div>
      </div>
    </main>
  );
}
