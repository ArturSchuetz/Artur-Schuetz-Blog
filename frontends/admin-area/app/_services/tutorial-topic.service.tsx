import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";
import { Media } from "./media.service";
import { TutorialCategory } from "./tutorial-category.service";
import { TutorialChapter } from "./tutorial-chapter.service";

import { PaginatedResponse } from "../_common/interfaces/paginated-response";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";

export interface TutorialTopic {
  id: number;
  position: number;
  name: string;
  description: string;
  slug: string;
  color: string;
  imageId: number | null;
  category: TutorialCategory | null;
  categoryId: number | null;
  chapters: TutorialChapter[] | null;
  medias: Media[] | null;
}

const topicsUrl = getConfig().apiUrl + "/tutorial-topics";

export const createTutorialTopic = async (topic: TutorialTopic): Promise<TutorialTopic> => {
  const response = await fetchWithTokenRefresh(topicsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(topic),
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

  return {} as TutorialTopic;
};

export const getTutorialTopics = async (): Promise<TutorialTopic[]> => {
  const url = `${topicsUrl}?page=1&pageSize=1000`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    return data.data as TutorialTopic[];
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

  return [] as TutorialTopic[];
};

export const getTutorialTopic = async (topicId: number | string): Promise<TutorialTopic> => {
  const url = `${topicsUrl}/getById?topicId=${topicId}`;
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

  return {} as TutorialTopic;
};

export const updateTutorialTopic = async (topic: TutorialTopic): Promise<TutorialTopic> => {
  const response = await fetchWithTokenRefresh(topicsUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(topic),
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

  return {} as TutorialTopic;
};

export const updateTutorialTopicImage = async (
  topicId: number,
  mediaId: number
): Promise<TutorialTopic> => {
  const url = `${topicsUrl}/addMedia`;
  const response = await fetchWithTokenRefresh(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mediaId: mediaId, topicId: topicId }),
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

  return {} as TutorialTopic;
};

export const deleteTutorialTopic = async (topicId: number): Promise<boolean> => {
  const response = await fetchWithTokenRefresh(topicsUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: topicId }),
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
