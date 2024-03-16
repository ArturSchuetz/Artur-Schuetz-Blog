import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetUserListResponse,
  GetUserListPaginatedResponse,
} from '../../data-transfer-objects/get-user-list-response.dto';
import { GetAllUsersQuery } from '../get-all-users.query';
import { User } from 'src/infrastructure/models/user.entity';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  private readonly logger = new Logger(GetAllUsersHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(
    query: GetAllUsersQuery,
  ): Promise<GetUserListPaginatedResponse> {
    /* this.logger.log(`Handling GetAllUsersQuery: ${JSON.stringify(query)}`); */

    const { pageNumber = 1, pageSize = 10 } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let users: User[];
    let count: number;

    try {
      [users, count] = await this.userRepository.findAndCount({
        skip: offset,
        take: pageSize,
      });
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getUserListPaginatedResponse: GetUserListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: users.map((user) => {
        const getUserListResponse = new GetUserListResponse();
        getUserListResponse.id = user.id;
        getUserListResponse.email = user.email;
        getUserListResponse.username = user.username;
        getUserListResponse.firstName = user.firstName;
        getUserListResponse.lastName = user.lastName;
        return getUserListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetAllUsersQuery: ${JSON.stringify(
        getUserListPaginatedResponse,
      )}`,
    ); */

    return getUserListPaginatedResponse;
  }
}
