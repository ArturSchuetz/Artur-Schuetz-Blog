export class GetAllTutorialCategoryTopicsQuery {
  constructor(
    public readonly categoryId: number,
    public readonly pageNumber: number,
    public readonly pageSize: number,
    public readonly isUserAuthenticated: boolean,
  ) {}
}
