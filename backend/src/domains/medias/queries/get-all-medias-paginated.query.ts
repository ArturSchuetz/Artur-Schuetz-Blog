export class GetAllMediasPaginatedQuery {
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number,
  ) {}
}
