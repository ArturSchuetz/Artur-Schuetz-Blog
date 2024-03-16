import { TutorialChapter } from 'src/infrastructure/models/tutorial-chapter.entity';
import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';
import { TutorialCategory } from 'src/infrastructure/models/tutorial-category.entity';

export class GetTutorialTopicListResponse {
  id: number;
  position: number;
  name: string;
  description: string;
  slug: string;
  color: string;
  imageId: number;
  category: TutorialCategory;
  categoryId: number;
  chapters: TutorialChapter[]; 
}

export type GetTutorialTopicListPaginatedResponse =
  PaginatedResponse<GetTutorialTopicListResponse>;
