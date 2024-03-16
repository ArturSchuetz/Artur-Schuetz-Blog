export class ProjectMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class GetProjectResponse {
  id: number;
  title: string;
  category: string;
  text: string;
  imageMediaId: number;
  background?: string;
  link: string;
  medias: ProjectMedia[];
  updatedAt: Date;
}
