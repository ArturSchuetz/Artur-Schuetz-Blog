export class TutorialTopicMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class UpdateTutorialTopicResponse {
  id: number;
  position: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  imageId: number;
  categoryId: number;
  medias: TutorialTopicMedia[];
}
