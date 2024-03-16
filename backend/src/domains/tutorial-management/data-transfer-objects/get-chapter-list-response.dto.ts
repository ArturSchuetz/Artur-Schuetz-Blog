import { TutorialArticle } from 'src/infrastructure/models/tutorial-article.entity';
import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';
import { TutorialTopic } from 'src/infrastructure/models/tutorial-topic.entity';

export class GetTutorialChapterListResponse {
  id: number;
  position: number;
  name: string;
  slug: string;
  imageId: number;
  topicId: number;
  topic: TutorialTopic;
  articles: TutorialArticle[];
}

export type GetTutorialChapterListPaginatedResponse =
  PaginatedResponse<GetTutorialChapterListResponse>;
