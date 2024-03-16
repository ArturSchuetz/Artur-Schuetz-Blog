import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';

export class GetTutorialCategoryListResponse {
  id: number;
  position: number;
  name: string;
  slug: string;
  color: string;
  imageId: number;
}

export type GetTutorialCategoryListPaginatedResponse =
  PaginatedResponse<GetTutorialCategoryListResponse>;
