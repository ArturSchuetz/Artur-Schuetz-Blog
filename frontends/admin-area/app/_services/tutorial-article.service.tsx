import { getConfig } from "@/config";
import { PaginatedResponse } from "../_common/interfaces/paginated-response";
import { TutorialChapter } from "./tutorial-chapter.service";
import { Media } from "./media.service";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";
import { fetchWithTokenRefresh } from "./helper.service";

export type Author = {
  id: number;
  firstName: string;
  lastName: string;
  avatarImageId: number;
  profile_picture: string;
  description: string;
  social_media: string[];
};

export interface TutorialArticle {
  id: number;
  position: number;
  title: string;
  slug: string;
  shortTitle: string;
  text: string;
  previewHostedVideoUrl: string | null;
  previewMediaId: number | null;
  previewText: string | null;
  tags: string | null;
  chapter: TutorialChapter | null;
  chapterId: number | null;
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: number | null;
  updatedAt: number | null;
  views: number;
  author: Author;
  medias: Media[] | null;
}

export interface TutorialArticleViewsOverview {
  Today: number;
  ThisWeek: number;
  ThisMonth: number;
  ThisYear: number;
  AllTime: number;
}

const articlesUrl = getConfig().apiUrl + "/tutorial-articles";

export const createTutorialArticle = async (article: TutorialArticle): Promise<TutorialArticle> => {
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
  return {} as TutorialArticle;
};

export const getViewsOverview = async (): Promise<TutorialArticleViewsOverview> => {
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
      throw new Error("Error fetching article views o verview");
    }
  }

  return {} as TutorialArticleViewsOverview;
};

export const getPaginatedTutorialArticles = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<TutorialArticle>> => {
  const url = `${articlesUrl}?page=${page}&pageSize=${pageSize}`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    return data as PaginatedResponse<TutorialArticle>;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error fetching articles: ", response.status);
      throw new Error("Error fetching articles: " + response.status);
    }
  }

  return {} as PaginatedResponse<TutorialArticle>;
};

export const getPaginatedTutorialChapterTutorialArticles = async (
  chapterId: number | string,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<TutorialArticle>> => {
  const url = `${articlesUrl}/byTutorialChapter?chapterId=${chapterId}&page=${page}&pageSize=${pageSize}`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    return data as PaginatedResponse<TutorialArticle>;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error("Error fetching articles: ", response.status);
      throw new Error("Error fetching articles: " + response.status);
    }
  }

  return {} as PaginatedResponse<TutorialArticle>;
};

export const getTutorialArticleMetaById = async (articleId: number | string): Promise<TutorialArticle> => {
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
      console.error("Error fetching articles: ", response.status);
      throw new Error("Error fetching articles: " + response.status);
    }
  }

  return {} as TutorialArticle;
};

export const getTutorialArticleById = async (articleId: number | string): Promise<TutorialArticle> => {
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
      console.error("Error fetching articles: ", response.status);
      throw new Error("Error fetching articles: " + response.status);
    }
  }

  return {} as TutorialArticle;
};

export const updateTutorialArticle = async (article: TutorialArticle): Promise<TutorialArticle> => {
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
      console.error("Error updating article: ", response.status);
      throw new Error("Error updating article: " + response.status);
    }
  }

  return {} as TutorialArticle;
};

export const updateTutorialArticleImage = async (
  articleId: number,
  mediaId: number
): Promise<TutorialArticle> => {
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
      console.error("Error updating article: ", response.status);
      throw new Error("Error updating article: " + response.status);
    }
  }

  return {} as TutorialArticle;
};

export const publishTutorialArticle = async (articleId: number): Promise<TutorialArticle> => {
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

  return {} as TutorialArticle;
};

export const deleteTutorialArticle = async (articleId: number): Promise<boolean> => {
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
