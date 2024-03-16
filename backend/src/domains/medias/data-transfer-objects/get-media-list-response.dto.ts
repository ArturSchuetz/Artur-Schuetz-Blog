import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';
export { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';

export class GetMediaListResponse {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export type GetMediaListPaginatedResponse =
  PaginatedResponse<GetMediaListResponse>;
