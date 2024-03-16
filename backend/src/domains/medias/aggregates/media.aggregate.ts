import { AggregateRoot } from '@nestjs/cqrs';

export class MediaAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly filepath: string,
    public readonly size: number,
    public readonly type: string,
    public readonly filename: string,
    public projectId: number,
    public blogArticleId: number,
    public blogCategoryId: number,
    public tutorialCategoryId: number,
    public tutorialTopicId: number,
    public tutorialChapterId: number,
    public tutorialArticleId: number,
    public userId: number,
  ) {
    super();
  }

  getId(): number {
    return this.id;
  }

  getFilepath(): string {
    return this.filepath;
  }

  getSize(): number {
    return this.size;
  }

  getType(): string {
    return this.type;
  }

  getFilename(): string {
    return this.filename;
  }

  getProjectId(): number {
    return this.projectId;
  }

  getArticleId(): number {
    return this.blogArticleId;
  }

  getCategoryId(): number {
    return this.blogCategoryId;
  }

  getTutorialCategoryId(): number {
    return this.tutorialCategoryId;
  }

  getTutorialTopicId(): number {
    return this.tutorialTopicId;
  }

  getTutorialChapterId(): number {
    return this.tutorialChapterId;
  }

  getTutorialArticleId(): number {
    return this.tutorialArticleId;
  }

  getUserId(): number {
    return this.userId;
  }

  static async create(
    id: number,
    filepath: string,
    size: number,
    type: string,
    filename: string,
    projectId?: number,
    blogArticleId?: number,
    blogCategoryId?: number,
    tutorialCategoryId?: number,
    tutorialTopicId?: number,
    tutorialChapterId?: number,
    tutorialArticleId?: number,
    userId?: number,
  ): Promise<MediaAggregate> {
    const media = new MediaAggregate(
      id,
      filepath,
      size,
      type,
      filename,
      projectId,
      blogArticleId,
      blogCategoryId,
      tutorialCategoryId,
      tutorialTopicId,
      tutorialChapterId,
      tutorialArticleId,
      userId,
    );
    return media;
  }
}
