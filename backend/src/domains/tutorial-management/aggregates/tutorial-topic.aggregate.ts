import { AggregateRoot } from '@nestjs/cqrs';

export class TutorialTopicAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly position: number,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly color: string,
    public readonly imageId: number,
    public readonly categoryId: number,
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

  getDescription(): string {
    return this.description;
  }

  getSlug(): string {
    return this.slug;
  }

  getColor(): string {
    return this.color;
  }

  getImageId(): number {
    return this.imageId;
  }

  getCategoryId(): number {
    return this.categoryId;
  }

  static async create(
    id: number,
    position: number,
    name: string,
    slug: string,
    description: string,
    color: string,
    imageId: number,
    categoryId: number,
  ): Promise<TutorialTopicAggregate> {
    const topic = new TutorialTopicAggregate(id, position, name, slug, description, color, imageId, categoryId);
    return topic;
  }
}
