export class TutorialArticleMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class UpdateTutorialArticleResponse {
  id: number;
  position: number;
  title: string;
  shortTitle: string;
  slug: string;
  previewHostedVideoUrl: string;
  previewMediaId: number;
  previewText?: string;
  tags: string[];
  text: string;
  chapterId: number;
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: Date;
  updatedAt: Date;
  medias: TutorialArticleMedia[];
}
