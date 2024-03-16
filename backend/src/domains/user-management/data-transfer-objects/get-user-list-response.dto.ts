import { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';
export { PaginatedResponse } from '../../../application/interfaces/paginated-response.dto';

export class GetUserListResponse {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export type GetUserListPaginatedResponse =
  PaginatedResponse<GetUserListResponse>;
