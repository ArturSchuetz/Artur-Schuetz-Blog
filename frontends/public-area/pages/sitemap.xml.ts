import { getConfig } from "@/config";
import siteConfig from "@/app/siteConfig.json";

import { GetServerSideProps, GetServerSidePropsContext } from "next/types";

import { PaginatedResponse } from "@/app/_common/interfaces/paginated-response";
import {
  BlogArticle,
  getPaginatedBlogArticles,
} from "@/app/_services/blog-article.service";
import { BlogCategory, getBlogCategories } from "@/app/_services/blog-category.service";
import { Project, getProjectCategories, getProjects } from "@/app/_services/project.service";

function createSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

function groupArticlesByCategory(articles: BlogArticle[], categories: BlogCategory[]): Record<string, BlogArticle[]> {
  const articlesByCategory: Record<string, BlogArticle[]> = {};

  // Initialisiere für jede Kategorie einen leeren Array in articlesByCategory
  categories.forEach(category => {
    articlesByCategory[category.id] = [];
  });

  // Durchlaufe jeden Artikel und füge ihn dem entsprechenden Kategorie-Array hinzu
  articles.forEach(article => {
    if (article.categoryId && articlesByCategory[article.categoryId]) {
      articlesByCategory[article.categoryId].push(article);
    }
  });

  return articlesByCategory;
}

function generateCategoryPageUrls(categories: BlogCategory[] | null, articlesByCategory: Record<string, BlogArticle[]>): string {
  let categoryPageUrls = '';

  if(categories != null) {
    for (const category of categories) {
      const categoryId = category.id;
      const categorySlug = category.slug;
      const totalArticlesInCategory = articlesByCategory[categoryId]?.length || 0;
      const totalPagesInCategory = Math.ceil(totalArticlesInCategory / siteConfig.settings.articlesPerPage);
      
      let latestReleasedAt = 0;
      const articlesInCategory = articlesByCategory[categoryId] || [];
      for (const article of articlesInCategory) {
        if (article && article.releasedAt) {
          const releasedAtTimestamp = new Date(article.releasedAt).getTime();
          if (releasedAtTimestamp > latestReleasedAt) {
            latestReleasedAt = releasedAtTimestamp;
          }
        }
      }

      for (let page = 1; page <= totalPagesInCategory; page++) {
        categoryPageUrls += `
          <url>
            <loc>${getConfig().baseUrl}/blog/category/${categorySlug}/page/${page}</loc>
            <lastmod>${new Date(latestReleasedAt).toISOString()}</lastmod>
            <priority>0.8</priority>
          </url>
        `;
      }
    }
  }

  return categoryPageUrls;
}

function getLatestUpdateForCategory(projectCategory: string, projects: Project[]) : number {
  let latestProjectAt = 0;
  for (const project of projects) {
    if (project && project.updatedAt) {
      if(projectCategory == project.category || projectCategory == 'all') {
        const projectUpdatedAtTimestamp = new Date(project.updatedAt).getTime();
        if (projectUpdatedAtTimestamp > latestProjectAt) {
          latestProjectAt = projectUpdatedAtTimestamp;
        }
      }
    }
  }
  return latestProjectAt;
}

function generateSiteMap({paginatedArticles, categories, articlesByCategory, projects, projectCategories}:{paginatedArticles: PaginatedResponse<BlogArticle>, categories: BlogCategory[] | null, articlesByCategory: Record<string, BlogArticle[]>, projects: Project[], projectCategories: string[]}) {

  const totalPages: number = Math.ceil(paginatedArticles.totalCount / siteConfig.settings.articlesPerPage);
  const categoryPages = generateCategoryPageUrls(categories, articlesByCategory);

  let latestReleasedAt = 0;
  const articlesInCategory = paginatedArticles.data || [];
  for (const article of articlesInCategory) {
    if (article && article.releasedAt) {
      const releasedAtTimestamp = new Date(article.releasedAt).getTime();
      if (releasedAtTimestamp > latestReleasedAt) {
        latestReleasedAt = releasedAtTimestamp;
      }
    }
  }

  let pagesUrls = '';
  for (let page = 1; page <= totalPages; page++) {
    pagesUrls += `
      <url>
        <loc>${getConfig().baseUrl}/home/${page}</loc>
        <lastmod>${new Date(latestReleasedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pagesUrls}
     <url>
       <loc>${getConfig().baseUrl}/about-me</loc>
       <changefreq>yearly</changefreq>
       <priority>0.5</priority>
     </url>
    <url>
      <loc>${getConfig().baseUrl}/portfolio/all</loc>
      <lastmod>${new Date(getLatestUpdateForCategory('all', projects)).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.2</priority>
    </url>
    ${projectCategories && projectCategories
      .map((projectCategory) => {
        return `
      <url>
        <loc>${getConfig().baseUrl}/portfolio/${createSlug(projectCategory)}</loc>
        <lastmod>${new Date(getLatestUpdateForCategory(projectCategory, projects)).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.2</priority>
      </url>
    `;
      })
      .join('')}
     <url>
       <loc>${getConfig().baseUrl}/contact</loc>
       <changefreq>yearly</changefreq>
       <priority>0.0</priority>
     </url>
     <url>
      <loc>${getConfig().baseUrl}/privacy-policy</loc>
      <changefreq>yearly</changefreq>
      <priority>0.0</priority>
     </url>
     <url>
      <loc>${getConfig().baseUrl}/cookie-privacy-policy</loc>
      <changefreq>yearly</changefreq>
      <priority>0.0</priority>
     </url>
     <url>
       <loc>${getConfig().baseUrl}/imprint</loc>
       <changefreq>yearly</changefreq>
       <priority>0.0</priority>
     </url>
     ${paginatedArticles.data && paginatedArticles.data
       .map((article) => {
         return `
       <url>
           <loc>${`${getConfig().baseUrl}/blog/article/${article.slug}`}</loc>
           <lastmod>${new Date(article.updatedAt ? article.updatedAt : 0).toISOString()}</lastmod>
           <priority>1.0</priority>
       </url>
     `;
       })
       .join('')}
      ${categoryPages}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { res } = context;

  let projectCategories = await getProjectCategories();
  let projects = await getProjects();
  const articlesResponse: PaginatedResponse<BlogArticle> = await getPaginatedBlogArticles(1, 999999999);

  const categoriesResponse: BlogCategory[] | null = await getBlogCategories();

   // Stelle sicher, dass Kategorien vorhanden sind, bevor du fortfährst
   if (!categoriesResponse) {
    // Fehlerbehandlung, falls keine Kategorien abgerufen werden konnten
    return { props: {} };
  }

  const articlesByCategory = groupArticlesByCategory(articlesResponse.data, categoriesResponse);

  const sitemap = generateSiteMap({ paginatedArticles: articlesResponse, categories: categoriesResponse, articlesByCategory: articlesByCategory, projects: projects, projectCategories: projectCategories });

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;