export class TutorialCategoryMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class GetTutorialCategoryResponse {
  id: number;
  position: number;
  name: string;
  slug: string;
  imageId: number;
  medias: TutorialCategoryMedia[];
}
