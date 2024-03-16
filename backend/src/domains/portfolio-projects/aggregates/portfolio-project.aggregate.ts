import { AggregateRoot } from '@nestjs/cqrs';

export class ProjectAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly category: string,
    public readonly text: string,
    public readonly link: string,
    public readonly imageMediaId: number,
    public readonly background?: string,
  ) {
    super();
  }

  getId(): number {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getCategory(): string {
    return this.category;
  }

  getText(): string {
    return this.text;
  }

  getLink(): string {
    return this.link;
  }

  getImageMediaId(): number {
    return this.imageMediaId;
  }

  getBackground(): string {
    return this.background;
  }

  static async create(
    id: number,
    title: string,
    category: string,
    text: string,
    link: string,
    imageMediaId: number,
    background: string,
  ): Promise<ProjectAggregate> {
    const project = new ProjectAggregate(
      id,
      title,
      category,
      text,
      link,
      imageMediaId,
      background,
    );
    return project;
  }
}
