import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";
import { Media } from "./media.service";

import { PaginatedResponse } from "../_common/interfaces/paginated-response";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";

export interface Project {
  id: number;
  title: string;
  category: string;
  text: string;
  imageMediaId: number | null;
  background: string | null;
  link: string;
  medias: Media[] | null;
  updatedAt: Date | null;
}

const projectsUrl = getConfig().apiUrl + "/projects";

export const createProject = async (project: Project): Promise<Project> => {
  const response = await fetchWithTokenRefresh(projectsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
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

  return {} as Project;
};

export const getProjectsPaginated = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Project>> => {
  const url = `${projectsUrl}/getAll?page=1&pageSize=1000`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    if (data.data) {
      (data as PaginatedResponse<Project>).data.forEach((project) => {
        project.medias = createUrlForMedia(project.medias);
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
  return {} as PaginatedResponse<Project>;
};

export const getProjects = async (): Promise<Project[]> => {
  const url = `${projectsUrl}/getAll?page=1&pageSize=1000`;
  const response = await fetchWithTokenRefresh(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (response.ok) {
    (data as PaginatedResponse<Project>).data.forEach((project) => {
      project.medias = createUrlForMedia(project.medias);
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

  return {} as Project[];
};

export const getProjectCategories = async (): Promise<string[]> => {
  const projects = await getProjects();
  const uniqueCategories = new Set<string>();
  projects.forEach((project) => {
    uniqueCategories.add(project.category);
  });
  const sortedCategories = Array.from(uniqueCategories).sort();
  return sortedCategories;

  return [] as string[];
};

export const getProjectById = async (projectId: number): Promise<Project> => {
  const url = `${projectsUrl}/getById?projectId=${projectId}`;
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

  return {} as Project;
};

export const updateProject = async (project: Project): Promise<Project> => {
  const response = await fetchWithTokenRefresh(projectsUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
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

  return {} as Project;
};

export const updateProjectImage = async (
  projectId: number,
  mediaId: number
): Promise<Project> => {
  const url = `${projectsUrl}/addMedia`;
  const response = await fetchWithTokenRefresh(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mediaId: mediaId, projectId: projectId }),
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

  return {} as Project;
};

export const deleteProject = async (projectId: number): Promise<boolean> => {
  const response = await fetchWithTokenRefresh(projectsUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: projectId }),
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
