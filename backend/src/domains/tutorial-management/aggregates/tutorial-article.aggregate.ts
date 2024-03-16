import { AggregateRoot } from '@nestjs/cqrs';

export class TutorialArticleAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly position: number,
    public readonly title: string,
    public readonly slug: string,
    public readonly shortTitle: string,
    public readonly previewHostedVideoUrl: string,
    public readonly previewMediaId: number,
    public readonly previewText: string,
    public readonly tags: string[],
    public readonly text: string,
    public readonly chapterId: number,
    public readonly useMathJax: boolean,
    public readonly isPublished: boolean,
    public readonly releasedAt: Date,
    public readonly authorId: number,
  ) {
    super();
  }

  getId(): number {
    return this.id;
  }

  getPosition(): number {
    return this.position;
  }

  getTitle(): string {
    return this.title;
  }

  getSlug(): string {
    return this.slug;
  }

  getShortTitle(): string {
    return this.shortTitle;
  }

  getText(): string {
    return this.text;
  }

  getPreviewMedia(): number {
    return this.previewMediaId;
  }

  getPreviewText(): string {
    return this.previewText;
  }

  getTags(): string[] {
    return this.tags;
  }

  getChapter(): number {
    return this.chapterId;
  }

  getUseMathJax(): boolean {
    return this.useMathJax;
  }

  getIsPublished(): boolean {
    return this.isPublished;
  }

  getReleasedAt(): Date {
    return this.releasedAt;
  }

  getAuthorId(): number {
    return this.authorId;
  }

  static async create(
    id: number,
    position: number,
    title: string,
    slug: string,
    shortTitle: string,
    previewHostedVideoUrl: string,
    previewMediaId: number,
    previewText: string,
    tags: string[],
    text: string,
    chapterId: number,
    useMathJax: boolean,
    isPublished: boolean,
    releasedAt: Date,
    authorId: number
  ): Promise<TutorialArticleAggregate> {
    const article = new TutorialArticleAggregate(
      id,
      position,
      title,
      slug,
      shortTitle,
      previewHostedVideoUrl,
      previewMediaId,
      previewText,
      tags,
      text,
      chapterId,
      useMathJax,
      isPublished,
      releasedAt,
      authorId,
    );
    return article;
  }
}
