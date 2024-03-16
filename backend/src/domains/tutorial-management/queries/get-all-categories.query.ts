export class GetAllTutorialCategoriesQuery {
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number,
  ) {}
}
