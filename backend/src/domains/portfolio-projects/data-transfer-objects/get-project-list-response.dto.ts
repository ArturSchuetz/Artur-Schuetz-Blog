import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';
export { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';

export class GetProjectListResponse {
  id: number;
  title: string;
  category: string;
  text: string;
  imageMediaId: number;
  background?: string;
  link: string;
  updatedAt: Date;
}

export type GetProjectListPaginatedResponse =
  PaginatedResponse<GetProjectListResponse>;
