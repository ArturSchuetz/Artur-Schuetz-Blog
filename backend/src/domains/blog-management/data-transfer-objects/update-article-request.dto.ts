export class UpdateBlogArticleRequest {
  id: number;
  title: string;
  text: string;
  titlePageImageId: number;
  previewHostedVideoUrl: string;
  previewMediaId: number;
  previewText?: string;
  tags: string[];
  advertisement?: string;
  categoryId: number;
  previousArticleId: number;
  nextArticleId: number;
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: Date;
  updatedAt: Date;
  views: number;
}
