export class GetAllMessagesQuery {
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number,
  ) {}
}
