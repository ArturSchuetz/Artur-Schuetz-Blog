import { TutorialChapter } from 'src/infrastructure/models/tutorial-chapter.entity';
import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';
export { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';

export class TutorialArticleAuthor {
  id: number;
  firstName: string;
  lastName: string;
  avatarImageId: number;
}

export class GetTutorialArticleListResponse {
  id: number;
  position: number;
  title: string;
  slug: string;
  shortTitle: string;
  previewHostedVideoUrl: string;
  previewMediaId: number;
  previewText: string;
  tags: string[];
  text: string;
  chapter: TutorialChapter;
  chapterId: number;
  useMathJax: boolean;
  isPublished: boolean;
  releasedAt: Date;
  author: TutorialArticleAuthor;
  views: number;
  updatedAt: Date;
}

export type GetTutorialArticleListPaginatedResponse =
  PaginatedResponse<GetTutorialArticleListResponse>;
