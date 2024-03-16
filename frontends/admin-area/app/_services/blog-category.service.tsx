import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";
import { Media } from "./media.service";

import { PaginatedResponse } from "@/app/_common/interfaces/paginated-response";
import UnauthorizedException from "@/app/_common/Exceptions/unauthorized-exception";
import NotFoundException from "@/app/_common/Exceptions/not-found-exception";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  titlePageImageId: number | null;
  medias: Media[] | null;
}

const categoriesUrl = getConfig().apiUrl + "/blog-categories";

export const createBlogCategory = async (category: BlogCategory): Promise<BlogCategory> => {
  const response = await fetchWithTokenRefresh(categoriesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
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
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return {} as BlogCategory;
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  const url = `${categoriesUrl}?page=1&pageSize=1000`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    return data.data as BlogCategory[];
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return [] as BlogCategory[];
};

export const getBlogCategory = async (categoryId: number | string): Promise<BlogCategory> => {
  const url = `${categoriesUrl}/getById?categoryId=${categoryId}`;
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
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return {} as BlogCategory;
};

export const updateBlogCategory = async (category: BlogCategory): Promise<BlogCategory> => {
  const response = await fetchWithTokenRefresh(categoriesUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  const data = await response.json();
  if (response.ok) {
    data.medias = createUrlForMedia(data.medias);
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return {} as BlogCategory;
};

export const updateBlogCategoryImage = async (
  categoryId: number,
  mediaId: number
): Promise<BlogCategory> => {
  const url = `${categoriesUrl}/addMedia`;
  const response = await fetchWithTokenRefresh(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mediaId: mediaId, categoryId: categoryId }),
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
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return {} as BlogCategory;
};

export const deleteBlogCategory = async (categoryId: number): Promise<boolean> => {
  const response = await fetchWithTokenRefresh(categoriesUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: categoryId }),
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
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return false;
};

// PRIVATE FUNCTIONS

const createUrlForMedia = (medias: Media[] | null): Media[] | null => {
  if (medias) {
    return medias.map((media) => {
      media.url = `${getConfig().apiUrl}/medias/${media.id}`;
      return media;
    });
  }
  return medias;
};
