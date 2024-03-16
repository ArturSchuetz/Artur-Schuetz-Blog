import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";

import Image from "next/image";
import Link from "next/link";

import Author from "@/app/_components/aside/author";
import Categories from "@/app/_components/aside/categories";
import Advertisement from "@/app/_components/aside/advertisement";
import LastProject from "@/app/_components/aside/lastProject";
import Tags from "@/app/_components/aside/tags";

import PostListItem from "@/app/_components/partial/postListItem";
import { Pagination } from "@/app/_components/partial/pagination";

import { PaginatedResponse } from '@/app/_common/interfaces/paginated-response';
import { getBlogCategories, BlogCategory } from "@/app/_services/blog-category.service";
import { getPaginatedBlogArticles, BlogArticle } from "@/app/_services/blog-article.service";

const formatTimestampToDate = (timeStamp: number) => {
  // Monatsnamen als Array von Strings
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Erstelle ein neues Date-Objekt aus dem Zeitstempel
  const date = new Date(timeStamp);

  // Extrahiere die einzelnen Komponenten des Datums
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Formatierung des Datums
  return `${monthNames[monthIndex]} ${day}, ${year}`;
};

const fetchHeaderArticles = async () => {
  const headlineArticles: PaginatedResponse<BlogArticle> = await getPaginatedBlogArticles(1, siteConfig.settings.articlesPerPage);
  const latestArticles: BlogArticle[] | null = headlineArticles.data;

  if (!latestArticles) return { headerArticlesPartOne: null, headerArticlesPartTwo: null }; // Stelle sicher, dass ein Wert zurückgegeben wird, wenn keine Daten verfügbar sind

  const filteredArticles = latestArticles.filter((article) => article.titlePageImageId != null);
  const headerArticlesPartOne = filteredArticles.slice(0, 2);
  const headerArticlesPartTwo = filteredArticles.slice(2, 5);

  return { headerArticlesPartOne, headerArticlesPartTwo };
};

const fetchTags = (articles: BlogArticle[] | null) => {
  let tags = "";
  if (articles) {
    articles.forEach(article => {
      if (!!article.tags) {
        tags += "," + article.tags;
      }
    });
  }
  let tagsArray: string[] = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
  let uniqueTagsArray = Array.from(new Set(tagsArray));
  return uniqueTagsArray.join(', ');
};

export async function generateMetadata({ params }: { params: { currentPage: number } }) {
  const currentPage: number = params.currentPage || 1;
  
  const page_title = "Blog Articles - Page " + currentPage;
  const site_description = 'Experienced C++ game developer and software engineer shares insights into 3D programming, Unreal Engine 5, machine learning, and modern web development. Discover unique projects, code snippets, and professional solutions from real-world experience.'

  const { headerArticlesPartOne, headerArticlesPartTwo } = await fetchHeaderArticles() || {};

  let openGraph_images: any = [];
  let openGraph_videos: any = [];
  let twitter_images: any[] = [];
  if (headerArticlesPartOne) {
    headerArticlesPartOne.forEach(article => {
      if (article.titlePageImageId != null) {
        openGraph_images.push({ url: `${getConfig().apiUrl}/medias/${
          article.titlePageImageId
        }`, alt: article.title });
        twitter_images.push({ url: new URL(`${getConfig().apiUrl}/medias/${
          article.titlePageImageId
        }`), alt: article.title });
      }
    });
  }

  if (headerArticlesPartTwo) {
    headerArticlesPartTwo.forEach(article => {
      if (article.titlePageImageId != null) {
        openGraph_images.push({ url: `${getConfig().apiUrl}/medias/${
          article.titlePageImageId
        }`, alt: article.title });
        twitter_images.push({ url: new URL(`${getConfig().apiUrl}/medias/${
          article.titlePageImageId
        }`), alt: article.title });
      }
    });
  }

  const tags = fetchTags(headerArticlesPartOne) + fetchTags(headerArticlesPartTwo);

  openGraph_images.push({ url: getConfig().baseUrl + "/img/00066-4008645638.png", alt: siteConfig.author.name });
  twitter_images.push({ url: new URL(getConfig().baseUrl + "/img/00066-4008645638.png"), alt: siteConfig.author.name });
  
  const categories: BlogCategory[] = await getBlogCategories();
  let categoriesStringArray: string[] = [];
  if (categories) {
    categories.forEach(category => {
      categoriesStringArray.push(category.name.toLocaleLowerCase());
    });
  }

  const keywords: string = categoriesStringArray.join(', ');
  const canonical_site_url = '/home/' + currentPage;

  return {
    title: page_title + ' | ' + siteConfig.site.title,
    description: site_description,
    keywords: 'artur, schütz, developer, blog, '+ keywords + (tags.length > 0 ? tags : ""),
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
  }
}

export default async function Home({ params }: { params: { currentPage: number } }) {
  const currentPage: number = params.currentPage || 1;

  const { headerArticlesPartOne, headerArticlesPartTwo } = await fetchHeaderArticles() || {};;

  let paginatedArticles: PaginatedResponse<BlogArticle> = await getPaginatedBlogArticles(currentPage, siteConfig.settings.articlesPerPage);
  let articles: BlogArticle[] | null = paginatedArticles.data;
  let totalPages: number = Math.ceil(paginatedArticles.totalCount / siteConfig.settings.articlesPerPage);

  let tags = fetchTags(articles);
  let tagsArray: string[] = tags.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
  let uniqueTagsArray = Array.from(new Set(tagsArray));

  return (
    <>
     <section className="banners">
        <div className="container">
          <div className="row">
            {headerArticlesPartOne?.map((article) => (
              <div key={`header_${article.id}`} className="col-md-6 col-xs-12">
                <div className="banner-wrapper">
                  <Link href={`/blog/article/${article.slug}`} title={article.title}>
                    <div className="banner-wrapper-content">
                      <h2 className="h4">{article.title}</h2>
                      <span className="banner-wrapper-content-tag category-tag-white">
                        {article.category?.name}
                      </span>
                      <time
                        dateTime={
                          article.releasedAt
                            ? new Date(article.releasedAt).toISOString()
                            : ""
                        }
                        className="banner-wrapper-content-time"
                      >
                        {formatTimestampToDate(
                          article.releasedAt || Date.now()
                        )}
                      </time>
                    </div>
                  </Link>
                  <Image
                    className="img-fluid"
                    src={`${getConfig().apiUrl}/medias/${
                      article.titlePageImageId
                    }`}
                    alt={article.title}
                    width="428"
                    height="366"
                  />
                </div>
              </div>
            ))}
            {headerArticlesPartTwo?.map((article) => (
              <div
                key={`header_${article.id}`}
                className="col-lg-4 col-md-6 col-xs-12"
              >
                <div className="banner-wrapper">
                  <Link href={`/blog/article/${article.slug}`} title={article.title}>
                    <div className="banner-wrapper-content">
                      <h2 className="h4">{article.title}</h2>
                      <span className="banner-wrapper-content-tag category-tag-white">
                        {article.category?.name}
                      </span>
                      <time
                        dateTime={
                          article.releasedAt
                            ? new Date(article.releasedAt).toISOString()
                            : ""
                        }
                        className="banner-wrapper-content-time"
                      >
                        {formatTimestampToDate(
                          article.releasedAt || Date.now()
                        )}
                      </time>
                    </div>
                  </Link>
                  <Image
                    className="img-fluid"
                    src={`${getConfig().apiUrl}/medias/${
                      article.titlePageImageId
                    }`}
                    alt={article.title}
                    width="271"
                    height="233"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <main>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-xs-12">
              <section className="articles">
                {articles?.map((article) => (
                  <PostListItem key={article.id} article={article} />
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePathName={`/home`}
                />
              </section>
            </div>

            <div className="aside-blocks col-lg-4 col-xs-12">
              <Author />
              <Categories />
              <Tags tags={uniqueTagsArray} /> 
              {/*
              <Advertisement />
              <LastProject />
              */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
