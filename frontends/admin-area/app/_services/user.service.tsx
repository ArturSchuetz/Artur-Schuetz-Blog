import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";
import { Media } from "./media.service";

import { PaginatedResponse } from "../_common/interfaces/paginated-response";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  salt: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  verificationToken: string;
  isVerified: boolean;
  avatarImageId: number;
  role: string;
  isActive: boolean;
  lastLogin: Date;
  metadata: string;
  medias: Media[] | null;
}

const usersUrl = getConfig().apiUrl + "/users";

export const getUsersPaginated = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<User>> => {
  const url = `${usersUrl}/getAll?page=1&pageSize=1000`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    if ((data as PaginatedResponse<User>).data) {
      (data as PaginatedResponse<User>).data.forEach((user) => {
        user.medias = createUrlForMedia(user.medias);
      });
    }
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

  return {} as PaginatedResponse<User>;
};

export const getUsers = async (): Promise<User[]> => {
  const url = `${usersUrl}/getAll?page=1&pageSize=1000`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    (data as PaginatedResponse<User>).data.forEach((user) => {
      user.medias = createUrlForMedia(user.medias);
    });
    return data.data;
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

  return {} as User[];
};

export const getUserById = async (userId: number): Promise<User> => {
  const url = `${usersUrl}/getById?userId=${userId}`;
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

  return {} as User;
};

export const getCurrentUser = async (): Promise<User> => {
  const url = `${usersUrl}/getCurrentUser`;
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

  return {} as User;
};

export const updateUser = async (user: Partial<User>): Promise<User> => {
  const response = await fetchWithTokenRefresh(usersUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
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

  return {} as User;
};

export const updateUserImage = async (
  userId: number,
  mediaId: number
): Promise<User> => {
  const url = `${usersUrl}/addMedia`;
  const response = await fetchWithTokenRefresh(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mediaId: mediaId, userId: userId }),
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

  return {} as User;
};

export const deleteUser = async (userId: number): Promise<boolean> => {
  const response = await fetchWithTokenRefresh(usersUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: userId }),
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
