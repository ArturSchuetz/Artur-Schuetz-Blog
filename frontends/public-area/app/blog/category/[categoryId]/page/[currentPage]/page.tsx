import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";

import Author from "@/app/_components/aside/author";
import Categories from "@/app/_components/aside/categories";
import Advertisement from "@/app/_components/aside/advertisement";
import LastProject from "@/app/_components/aside/lastProject";
import Tags from "@/app/_components/aside/tags";

import PostListItem from "@/app/_components/partial/postListItem";
import { Pagination } from "@/app/_components/partial/pagination";
import {
  BlogArticle,
  getPaginatedBlogCategoryBlogArticles,
} from "@/app/_services/blog-article.service";
import { BlogCategory, getBlogCategories, getBlogCategory } from "@/app/_services/blog-category.service";
import { PaginatedResponse } from "@/app/_common/interfaces/paginated-response";

export async function generateMetadata({
  params,
}: {
  params: { categoryId: number | string; currentPage: number };
}) {
  const { categoryId, currentPage = 1 } = params;

  const paginatedArticles: PaginatedResponse<BlogArticle> = await getPaginatedBlogCategoryBlogArticles(categoryId, currentPage, siteConfig.settings.articlesPerPage);
  const totalArticles: number= paginatedArticles.totalCount;
  const totalPages: number = Math.ceil(paginatedArticles.totalCount / siteConfig.settings.articlesPerPage);
  const articles : BlogArticle[] | null = paginatedArticles.data;
  const category: BlogCategory | null = await getBlogCategory(categoryId);

  const page_title = category.name + " Blog Articles - Page " + currentPage;
  const site_description = 'Delve into Artur Schütz’s extensive collection of blog articles on ' + category.name + '. Each post offers clear and direct insights, ranging from beginner tutorials to advanced discussions, encompassing the latest trends and techniques in ' + category.name + '. Whether you’re a seasoned professional or just starting out, this blog is your go-to resource for ' + category.name + '.'
  
  let openGraph_images: any = [];
  let openGraph_videos: any = [];
  let twitter_images: any[] = [];

  let tags = "";
  if (articles) {
    let articlesCount = 0;
    articles.forEach(article => {
      if(!!article.tags) {
        tags += "," + article.tags;
      }
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
      articlesCount++;
    });
  }

  let tagsArray: string[] = tags.split(',').map(tag => tag.trim());
  let uniqueTagsArray = Array.from(new Set(tagsArray));
  tags = uniqueTagsArray.join(', ');

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
  const canonical_site_url = '/blog/category/' + category.slug + '/page/' + currentPage;

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
    category: category?.name
  }
}

export default async function BlogCategory({
  params,
}: {
  params: { categoryId: number; currentPage: number };
}) {
  const { categoryId, currentPage = 1 } = params;

  const paginatedArticles: PaginatedResponse<BlogArticle> = await getPaginatedBlogCategoryBlogArticles(categoryId, currentPage, siteConfig.settings.articlesPerPage);
  const totalArticles: number= paginatedArticles.totalCount;
  const totalPages: number = Math.ceil(paginatedArticles.totalCount / siteConfig.settings.articlesPerPage);
  const articles : BlogArticle[] | null = paginatedArticles.data;
  const category: BlogCategory | null = await getBlogCategory(categoryId);
  
  let tags = "";
  if (articles) {
    articles.forEach(article => {
      if(!!article.tags) {
        tags += "," + article.tags;
      }
    });
  }
  let tagsArray: string[] = tags.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
  let uniqueTagsArray = Array.from(new Set(tagsArray));
  
  return (
      <main>
        <div className="container">
          {category && articles && (
            <div className="category-title d-flex align-items-center justify-content-between">
              <h1 className="h1">{category.name}</h1>
              <span className="category-title-text">
                {totalArticles} articles
              </span>
            </div>
          )}
          <div className="row">
            <div className="col-lg-8 col-xs-12">
              <section className="articles">
                {articles?.map((article) => (
                  <PostListItem key={article.id} article={article} />
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePathName={`/blog/category/${categoryId}/page`}
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
  );
}
