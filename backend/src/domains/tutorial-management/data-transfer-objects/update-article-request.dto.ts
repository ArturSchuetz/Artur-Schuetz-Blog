export class UpdateTutorialArticleRequest {
  id: number;
  position: number;
  title: string;
  shortTitle: string;
  text: string;
  previewHostedVideoUrl: string;
  previewMediaId: number;
  previewText?: string;
  tags: string[];
  chapterId: number;
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: Date;
  updatedAt: Date;
  views: number;
}
