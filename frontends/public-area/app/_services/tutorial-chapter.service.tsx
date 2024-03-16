import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";
import { Media } from "./media.service";
import { TutorialTopic } from "./tutorial-topic.service";
import { TutorialArticle } from "./tutorial-article.service";

import { PaginatedResponse } from "../_common/interfaces/paginated-response";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";

export interface TutorialChapter {
  id: number;
  position: number;
  name: string;
  slug: string;
  imageId: number | null;
  topic: TutorialTopic | null;
  topicId: number | null;
  articles: TutorialArticle[] | null;
  medias: Media[] | null;
}

const chaptersUrl = getConfig().apiUrl + "/tutorial-chapters";

export const createTutorialChapter = async (chapter: TutorialChapter): Promise<TutorialChapter> => {
  const response = await fetchWithTokenRefresh(chaptersUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chapter),
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

  return {} as TutorialChapter;
};

export const getTutorialChapters = async (): Promise<TutorialChapter[]> => {
  const url = `${chaptersUrl}?page=1&pageSize=1000`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    return data.data as TutorialChapter[];
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

  return [] as TutorialChapter[];
};


export const getTutorialChaptersByTopic = async (topicId: number): Promise<TutorialChapter[]> => {
  const url = `${chaptersUrl}/getByTopicId?topicId=${topicId}&page=1&pageSize=1000`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    return data.data as TutorialChapter[];
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

  return [] as TutorialChapter[];
};

export const getTutorialChapter = async (chapterId: number): Promise<TutorialChapter> => {
  const url = `${chaptersUrl}/getById?chapterId=${chapterId}`;
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

  return {} as TutorialChapter;
};

export const updateTutorialChapter = async (chapter: TutorialChapter): Promise<TutorialChapter> => {
  const response = await fetchWithTokenRefresh(chaptersUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chapter),
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

  return {} as TutorialChapter;
};

export const updateTutorialChapterImage = async (
  chapterId: number,
  mediaId: number
): Promise<TutorialChapter> => {
  const url = `${chaptersUrl}/addMedia`;
  const response = await fetchWithTokenRefresh(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mediaId: mediaId, chapterId: chapterId }),
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

  return {} as TutorialChapter;
};

export const deleteTutorialChapter = async (chapterId: number): Promise<boolean> => {
  const response = await fetchWithTokenRefresh(chaptersUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: chapterId }),
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
