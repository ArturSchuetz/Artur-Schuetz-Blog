import { BlogCategory } from 'src/infrastructure/models/blog-category.entity';
import { PageView } from 'src/infrastructure/models/page-view.entity';

export class ProjectMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class BlogArticleAuthorResponse {
  id: number;
  firstName: string;
  lastName: string;
  avatarImageId: number;
}

export class GetBlogArticleResponse {
  id: number;
  title: string;
  slug: string;
  text: string;
  titlePageImageId: number;
  previewHostedVideoUrl: string;
  previewMediaId: number;
  previewText?: string;
  advertisement?: string;
  tags?: string[];
  category: BlogCategory;
  categoryId: number;
  previousArticle: any;
  previousArticleId: number;
  nextArticle: any;
  nextArticleId: number;
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: Date;
  updatedAt: Date;
  views: PageView[];
  medias: ProjectMedia[];
  author: BlogArticleAuthorResponse;
}
