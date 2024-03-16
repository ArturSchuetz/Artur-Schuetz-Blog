import { AggregateRoot } from '@nestjs/cqrs';

export class TutorialCategoryAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly position: number,
    public readonly name: string,
    public readonly slug: string,
    public readonly imageId: number,
  ) {
    super();
  }

  getId(): number {
    return this.id;
  }

  getPosition(): number {
    return this.position;
  }

  getName(): string {
    return this.name;
  }

  getSlug(): string {
    return this.slug;
  }

  getImageId(): number {
    return this.imageId;
  }

  static async create(
    id: number,
    position: number,
    name: string,
    slug: string,
    imageId: number,
  ): Promise<TutorialCategoryAggregate> {
    const category = new TutorialCategoryAggregate(id, position, name, slug, imageId);
    return category;
  }
}
