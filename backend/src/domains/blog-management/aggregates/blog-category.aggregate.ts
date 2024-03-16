import { AggregateRoot } from '@nestjs/cqrs';

export class BlogCategoryAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly slug: string,
    public readonly color: string,
    public readonly titlePageImageId: number,
  ) {
    super();
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getSlug(): string {
    return this.slug;
  }

  getColor(): string {
    return this.color;
  }

  getTitlePageImageId(): number {
    return this.titlePageImageId;
  }

  static async create(
    id: number,
    name: string,
    slug: string,
    color: string,
    titlePageImageId: number,
  ): Promise<BlogCategoryAggregate> {
    const category = new BlogCategoryAggregate(id, name, slug, color, titlePageImageId);
    return category;
  }
}
