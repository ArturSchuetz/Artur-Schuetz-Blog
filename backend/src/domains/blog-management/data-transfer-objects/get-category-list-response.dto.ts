import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';

export class GetBlogCategoryListResponse {
  id: number;
  name: string;
  slug: string;
  color: string;
  titlePageImageId: number;
}

export type GetCategoryListPaginatedResponse =
  PaginatedResponse<GetBlogCategoryListResponse>;
