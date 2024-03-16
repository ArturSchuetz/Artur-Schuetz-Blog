import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";
import { BlogCategory } from "./blog-category.service";
import { Media } from "./media.service";

import { PaginatedResponse } from "@/app/_common/interfaces/paginated-response";
import UnauthorizedException from "@/app/_common/Exceptions/unauthorized-exception";
import NotFoundException from "@/app/_common/Exceptions/not-found-exception";

export type Author = {
  id: number;
  firstName: string;
  lastName: string;
  avatarImageId: number;
  profile_picture: string;
  description: string;
  social_media: string[];
};

export interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  text: string;
  titlePageImageId: number | null;
  previewHostedVideoUrl: string | null;
  previewMediaId: number | null;
  previewText: string | null;
  advertisement: string | null;
  tags: string | null;
  category: BlogCategory | null;
  categoryId: number | null;
  previousArticle: BlogArticle | null;
  previousArticleId: number | null;
  nextArticle: BlogArticle | null;
  nextArticleId: number | null;
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: number | null;
  updatedAt: number | null;
  views: number;
  author: Author;
  medias: Media[] | null;
}

export interface BlogArticleViewsOverview {
  Today: number;
  ThisWeek: number;
  ThisMonth: number;
  ThisYear: number;
  AllTime: number;
}

const articlesUrl = getConfig().apiUrl + "/blog-articles";

export const createBlogArticle = async (article: BlogArticle): Promise<BlogArticle> => {
  const response = await fetchWithTokenRefresh(articlesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
  });

  const data = await response.json();
  if (response.ok) {
    data.medias = createUrlForMedia(data.medias);
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error creating article");
      throw new Error("Error creating article");
    }
  }
  return {} as BlogArticle;
};

export const getViewsOverview = async (): Promise<BlogArticleViewsOverview> => {
  const url = `${articlesUrl}/getViewsOverview`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error fetching article views overview");
      throw new Error("Error fetching article views overview");
    }
  }

  return {} as BlogArticleViewsOverview;
};

export const getPaginatedBlogArticles = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<BlogArticle>> => {

  const url = `${articlesUrl}?page=${page}&pageSize=${pageSize}`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    return data as PaginatedResponse<BlogArticle>;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error fetching articles");
      throw new Error("Error fetching articles");
    }
  }

  return {} as PaginatedResponse<BlogArticle>;
};

export const getPaginatedBlogCategoryBlogArticles = async (
  categoryId: number | string,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<BlogArticle>> => {
  const url = `${articlesUrl}/byCategory?categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    return data as PaginatedResponse<BlogArticle>;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error fetching articles");
      throw new Error("Error fetching articles");
    }
  }

  return {} as PaginatedResponse<BlogArticle>;
};

export const getBlogArticleMetaById = async (articleId: number | string): Promise<BlogArticle> => {
  const url = `${articlesUrl}/getMetaById?articleId=${articleId}`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    data.medias = createUrlForMedia(data.medias);
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error fetching article");
      throw new Error("Error fetching article");
    }
  }

  return {} as BlogArticle;
};

export const getBlogArticleById = async (articleId: number | string): Promise<BlogArticle> => {
  const url = `${articlesUrl}/getById?articleId=${articleId}`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    data.medias = createUrlForMedia(data.medias);
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error fetching article");
      throw new Error("Error fetching article");
    }
  }

  return {} as BlogArticle;
};

export const updateBlogArticle = async (article: BlogArticle): Promise<BlogArticle> => {
  const response = await fetchWithTokenRefresh(articlesUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
  });

  const data = await response.json();
  if (response.ok) {
    data.medias = createUrlForMedia(data.medias);
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error updating article");
      throw new Error("Error updating article");
    }
  }

  return {} as BlogArticle;
};

export const updateBlogArticleImage = async (
  articleId: number,
  mediaId: number
): Promise<BlogArticle> => {
  const url = `${articlesUrl}/addMedia`;
  const response = await fetchWithTokenRefresh(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mediaId: mediaId, articleId: articleId }),
  });

  const data = await response.json();
  if (response.ok) {
    data.medias = createUrlForMedia(data.medias);
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error updating article");
      throw new Error("Error updating article");
    }
  }

  return {} as BlogArticle;
};

export const publishBlogArticle = async (articleId: number): Promise<BlogArticle> => {
  const url = `${articlesUrl}/publish`;
  const response = await fetchWithTokenRefresh(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: articleId }),
  });

  const data = await response.json();
  if (response.ok) {
    data.medias = createUrlForMedia(data.medias);
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error publishing article");
      throw new Error("Error publishing article");
    }
  }

  return {} as BlogArticle;
};

export const deleteBlogArticle = async (articleId: number): Promise<boolean> => {
  const response = await fetchWithTokenRefresh(articlesUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: articleId }),
  });

  const data = await response.json();
  if (response.ok) {
    return true;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error deleting article");
      throw new Error("Error deleting article");
    }
  }

  return false;
};

const createUrlForMedia = (medias: Media[] | null): Media[] | null => {
  if (medias) {
    return medias.map((media) => {
      media.url = `${getConfig().apiUrl}/medias/${media.id}`;
      return media;
    });
  }
  return medias;
};
