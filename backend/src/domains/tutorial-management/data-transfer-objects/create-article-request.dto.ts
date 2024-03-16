export class CreateTutorialArticleRequest {
  position: number;
  title: string;
  shortTitle: string;
  previewHostedVideoUrl: string;
  previewMediaId: number;
  previewText?: string;
  tags: string[];
  text: string;
  chapterId: number;
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: Date;
  authorId: number;
  views: number;
  updatedAt: Date;
}
