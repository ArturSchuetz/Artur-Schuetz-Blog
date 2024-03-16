import { BlogCategory } from 'src/infrastructure/models/blog-category.entity';
import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';
export { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';

export class BlogArticleAuthor {
  id: number;
  firstName: string;
  lastName: string;
  avatarImageId: number;
}

export class GetBlogArticleListResponse {
  id: number;
  title: string;
  slug: string;
  titlePageImageId: number;
  previewHostedVideoUrl: string;
  previewMediaId: number;
  previewText: string;
  tags: string[];
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: Date;
  updatedAt: Date;
  categoryId: number;
  category: BlogCategory;
  views: number;
  author: BlogArticleAuthor;
}

export type GetArticleListPaginatedResponse =
  PaginatedResponse<GetBlogArticleListResponse>;
