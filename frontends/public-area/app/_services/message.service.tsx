import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";
import { Media } from "./media.service";

import { PaginatedResponse } from "../_common/interfaces/paginated-response";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const messagesUrl = getConfig().apiUrl + "/messages";

export async function sendContactFormData(formData: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const response = await fetchWithTokenRefresh(messagesUrl, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const json = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: "Email successfully sent! We will get back to you soon.",
      };
    } else {
      if (response.status === 401) {
        throw new UnauthorizedException();
      } else {
        return {
          success: false,
          message: json.error || "Something went wrong",
        };
      }
    }
  } catch (error) {
    return { success: false, message: "Network error, please try again later" };
  }
}

export const createMessage = async (message: Message): Promise<Message> => {
  const response = await fetchWithTokenRefresh(messagesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
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

  return {} as Message;
};

export const getMessagesPaginated = async (
  page: number,
  pageSize: number,
  folder: string,
  filters: any
): Promise<PaginatedResponse<Message>> => {
  const url = `${messagesUrl}/getAll?page=${page}&pageSize=${pageSize}`;
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
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return {} as PaginatedResponse<Message>;
};

export const getMessageById = async (messageId: number): Promise<Message> => {
  const url = `${messagesUrl}/getById/${messageId}`;
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

  return {} as Message;
};

export const markMessageAsRead = async (
  messageId: number
): Promise<Message> => {
  const url = `${messagesUrl}/markAsRead`;
  const response = await fetchWithTokenRefresh(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: messageId }),
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
};

export const deleteMessage = async (messageId: number): Promise<boolean> => {
  const response = await fetchWithTokenRefresh(messagesUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: messageId }),
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

const createUrlForMedia = (medias: Media[] | null): Media[] | null => {
  if (medias) {
    return medias.map((media) => {
      media.url = `${getConfig().apiUrl}/medias/${media.id}`;
      return media;
    });
  }
  return medias;
};
