import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";

import UnauthorizedException from "@/app/_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";

export interface Media {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
}

const mediasUrl = getConfig().apiUrl + "/medias";

const mime_type_to_category_map: { [key: string]: string[] } = {
  Images: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/svg+xml",
    "image/webp",
  ],
  Videos: [
    "video/mp4",
    "video/x-msvideo",
    "video/x-matroska",
    "video/x-flv",
    "video/quicktime",
    "video/x-ms-wmv",
  ],
  Docs: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ],
  Music: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac", "audio/aac"],
  Downloads: [
    "application/zip",
    "application/vnd.rar",
    "application/x-7z-compressed",
  ],
  More: ["application/json", "application/xml"],
};

export const getMedias = async (): Promise<Media[] | null> => {
  const url = `${mediasUrl}`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    (data as Media[]).forEach((media) => {
      media.url = `${getConfig().apiUrl}/medias/${media.id}`;
    });
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
};

export const findMediaById = async (id: number): Promise<Media | null> => {
  const url = `${mediasUrl}/${id}`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    (data as Media).url = `${getConfig().apiUrl}/medias/${data.id}`;
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
};

export const deleteMedia = async (mediaId: number) => {
  const response = await fetchWithTokenRefresh(`${mediasUrl}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: mediaId }),
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

//
// PRIVATE METHODS
//

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const mime_type_to_category = (mime_type: string): string => {
  for (const [category, mime_types] of Object.entries(
    mime_type_to_category_map
  )) {
    if (mime_types.includes(mime_type)) {
      return category;
    }
  }
  return "Unknown";
};
