import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";

import "prismjs/themes/prism.css";

import Image from "next/image";
import Link from "next/link";

import MarkdownText from "@/app/_components/partial/markdownText";
import NotFoundException from "@/app/_common/Exceptions/not-found-exception";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { getSocialIconClass } from "@/app/_services/helper.service";
import { MarkdownService } from "@/app/_services/markdown.service";

import { TutorialArticle, getTutorialArticleById, getTutorialArticleMetaById } from "@/app/_services/tutorial-article.service";
import { TutorialChapter, getTutorialChapter, getTutorialChapters } from "@/app/_services/tutorial-chapter.service";
import { TutorialTopic, getTutorialTopic } from "@/app/_services/tutorial-topic.service";

export async function generateMetadata({ params }: { params: { postId: number | string } }) {
  const { postId } = params;

  let article: TutorialArticle | null = await getTutorialArticleMetaById(postId);
  let chapter: TutorialChapter | null = await getTutorialChapter(article?.chapterId ? article.chapterId : 0);
  let releasedAtString: string | null = null;
  let updatedAtString: string | null = null;

  if (article) {
    article.author = {
      id: 1,
      firstName: "Artur",
      lastName: "Schütz",
      avatarImageId: 1,
      profile_picture: "/img/00066-4008645638.png",
      description:
        "Senior Full-Stack Software Developer at bitside GmbH, who excels in agile methodologies and machine learning, continuously evolving to deliver versatile and sustainable solutions while also pursuing game development and AI research.",
      social_media: [
        "https://github.com/ArturSchuetz",
        "https://twitter.com/Artur_Schuetz",
        "https://www.facebook.com/art.schuetz",
        "https://www.youtube.com/channel/UCsNTHFFLq1by_kYqgHPyTmQ",
        "https://www.linkedin.com/in/arturschuetz/",
      ],
    };

    releasedAtString = article.releasedAt ? new Date(article.releasedAt).toISOString() : ""
    updatedAtString = article.updatedAt ? new Date(article.updatedAt).toISOString() : ""
  }
  
  let page_title = article.title;
  if(chapter?.topic) {
    page_title += ` | ${chapter?.topic?.name} Tutorial`;
  }
  const site_description = article.previewText;
  
  let openGraph_images: any = [];
  let openGraph_videos: any = [];
  let twitter_images: any[] = [];

  if (article) {
    if(article.previewMediaId != null) {
      openGraph_images.push({ url: `${getConfig().apiUrl}/medias/${
        article.previewMediaId
      }`, alt: article.title });
      twitter_images.push({ url: new URL(`${getConfig().apiUrl}/medias/${
        article.previewMediaId
      }`), alt: article.title });
    }

    if(article.previewHostedVideoUrl != null) {
      openGraph_videos.push({ url: article.previewHostedVideoUrl });
    }
  }

  let keywords: string = article.tags ? article.tags : "";
  if(article.chapter) {
    if(keywords.length > 0) {
      keywords += ", ";
    }
    keywords += article.chapter?.name;
  }

  if(chapter && chapter?.topic) {
    if(keywords.length > 0) {
      keywords += ", ";
    }
    keywords += chapter?.topic?.name
  }

  const canonical_site_url = '/tutorials/article/' + article.slug;

  return {
    title: page_title + ' | ' + siteConfig.site.title,
    description: site_description,
    keywords: keywords,
    alternates: { canonical: canonical_site_url },
    openGraph: {
      type: 'article',
      publishedTime: releasedAtString ? releasedAtString : null,
      modifiedTime: updatedAtString ? updatedAtString : null,
      authors: article.author.firstName + ' ' +  article.author.lastName,
      tags: article.tags ? article.tags : null,
      section: article.chapter ? article.chapter?.name : null,
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
    category: chapter?.topic?.name
  }
}

export default async function TutorialPost({ params }: { params: { postId: number } }) {
  const { postId } = params;

  const article: TutorialArticle | null = await getTutorialArticleById(postId);
  const chapter: TutorialChapter | null = await getTutorialChapter(article?.chapterId ? article.chapterId : 0);

  let isNewArticle: boolean | null = false;
  let postetTimespan: string | null = null;
  let releasedAtString: string | null = null;

  postetTimespan = null;
  isNewArticle = false;

  if (article && !postetTimespan) {
    article.author = {
      id: 1,
      firstName: "Artur",
      lastName: "Schütz",
      avatarImageId: 1,
      profile_picture: "/img/00066-4008645638.png",
      description:
        "Senior Full-Stack Software Developer at bitside GmbH, who excels in agile methodologies and machine learning, continuously evolving to deliver versatile and sustainable solutions while also pursuing game development and AI research.",
      social_media: [
        "https://github.com/ArturSchuetz",
        "https://twitter.com/Artur_Schuetz",
        "https://www.facebook.com/art.schuetz",
        "https://www.youtube.com/channel/UCsNTHFFLq1by_kYqgHPyTmQ",
        "https://www.linkedin.com/in/arturschuetz/",
      ],
    };

    const releaseTime =
      article.releasedAt !== null
        ? new Date(article.releasedAt).getTime()
        : Date.now();
    releasedAtString = article.releasedAt ? new Date(article.releasedAt).toISOString() : ""
    
    var seconds = (Date.now() - releaseTime) / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var weeks = days / 7;
    var months = days / 30.4167;
    var years = days / 365;

    if (weeks <= 1) isNewArticle = true;

    let postetTimespanTemp = "";
    if (years >= 1)
      postetTimespanTemp = String(years.toFixed(0)) + " years ago";
    else if (months >= 1)
      postetTimespanTemp = String(months.toFixed(0)) + " months ago";
    else if (weeks >= 1)
      postetTimespanTemp = String(weeks.toFixed(0)) + " weeks ago";
    else if (days >= 1)
      postetTimespanTemp = String(days.toFixed(0)) + " days ago";
    else if (hours >= 1)
      postetTimespanTemp = String(hours.toFixed(0)) + " hours ago";
    else if (minutes >= 1)
      postetTimespanTemp = String(minutes.toFixed(0)) + " minutes ago";
    else postetTimespanTemp = String(seconds.toFixed(0)) + " seconds ago";

    postetTimespan = postetTimespanTemp;
  }

  const htmlText = article != null ? (article?.text ? MarkdownService.convert(article.text) : "") : "";
  return (
    <main>
      {article ? (
        <div className="container">
          <div className="articles-blog-post">
            <div className="row">
              <article className="articles">
                <div className="articles-header">
                  <time dateTime={`${releasedAtString}`}>
                    {postetTimespan}
                  </time>
                  {isNewArticle && (
                    <span className="articles-header-tag">New</span>
                  )}
                  <span className="articles-header-category">
                    <Link
                      href={`/tutorials/topic/${chapter?.topic?.slug}`}
                      className={chapter?.topic?.color}
                      title={chapter?.topic?.name}
                    >
                      {chapter?.topic?.name}
                    </Link>
                  </span>
                </div>
                <div className="articles-content px-8">
                  <h1 className="articles-blog-post-tile fw-900">
                    {article.title}
                  </h1>
                  {!article.useMathJax && <div dangerouslySetInnerHTML={{ __html: htmlText }} />}
                  {article.useMathJax && (<MarkdownText text={article.text} />)}
                </div>
              </article>
            </div>
          </div>
          {article.author && (
            <section className="blog-post-bottom-section">
              <div>
                <div className="articles-info col-xs-12 col-lg-10">
                  <div className="articles-author d-flex">
                    <Image
                      className="articles-author-img roundprofilepicture"
                      src={article.author.profile_picture}
                      alt="Profile picture"
                      width={75}
                      height={75}
                    />
                    <div className="articles-author-content">
                      <div className="articles-author-header d-flex justify-content-between align-items-md-center flex-column flex-md-row">
                        <h4 className="">
                          {article.author.firstName +
                            " " +
                            article.author.lastName}
                        </h4>
                        <div className="author-social d-flex align-items-center">
                          {article.author.social_media &&
                            article.author.social_media.map(
                              (social_media_link, index) => (
                                <a
                                  key={`${getSocialIconClass(
                                    social_media_link
                                  )}-${index}`}
                                  href={social_media_link}
                                  className="social-icon"
                                  title="Social Media"
                                >
                                  {getSocialIconClass(social_media_link) &&
                                  <FontAwesomeIcon icon={getSocialIconClass(social_media_link) as IconProp} />
                                  }
                                </a>
                              )
                            )}
                        </div>
                      </div>
                      <p className="font-primary articles-author-content-text">
                        {article.author.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          <script
            async
            src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"
          ></script>
        </div>
      ) : (
        <div className="container">Artikel wird geladen...</div>
      )}
    </main>
  );
}
