import { AggregateRoot } from '@nestjs/cqrs';

export class TutorialChapterAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly position: number,
    public readonly name: string,
    public readonly slug: string,
    public readonly imageId: number,
    public readonly topicId: number,
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

  getTopicId(): number {
    return this.topicId;
  }

  static async create(
    id: number,
    position: number,
    name: string,
    slug: string,
    imageId: number,
    topicId: number,
  ): Promise<TutorialChapterAggregate> {
    const chapter = new TutorialChapterAggregate(id, position, name, slug, imageId, topicId);
    return chapter;
  }
}
