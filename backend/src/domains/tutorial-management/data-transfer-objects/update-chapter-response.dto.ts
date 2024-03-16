export class TutorialChapterMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class UpdateTutorialChapterResponse {
  id: number;
  position: number;
  name: string;
  slug: string;
  imageId: number;
  topicId: number;
  medias: TutorialChapterMedia[];
}
