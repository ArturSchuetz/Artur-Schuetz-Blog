export class BlogArticleMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class UpdateBlogArticleResponse {
  id: number;
  title: string;
  slug: string;
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
  medias: BlogArticleMedia[];
}
