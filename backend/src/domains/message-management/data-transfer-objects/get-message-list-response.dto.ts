import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';
export { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';

export class GetMessageListResponse {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export type GetMessageListPaginatedResponse =
  PaginatedResponse<GetMessageListResponse>;
