import { AggregateRoot } from '@nestjs/cqrs';

export class BlogArticleAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly slug: string,
    public readonly text: string,
    public readonly titlePageImageId: number,
    public readonly previewHostedVideoUrl: string,
    public readonly previewMediaId: number,
    public readonly previewText: string,
    public readonly advertisement: string,
    public readonly tags: string[],
    public readonly categoryId: number,
    public readonly previousArticleId: number,
    public readonly nextArticleId: number,
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

  getTitle(): string {
    return this.title;
  }

  getSlug(): string {
    return this.slug;
  }

  getText(): string {
    return this.text;
  }

  getTitlePageImage(): number {
    return this.titlePageImageId;
  }

  getPreviewHostedVideoUrl(): string {
    return this.previewHostedVideoUrl;
  }

  getPreviewMedia(): number {
    return this.previewMediaId;
  }

  getPreviewText(): string {
    return this.previewText;
  }

  getAdvertisement(): string {
    return this.advertisement;
  }

  getTags(): string[] {
    return this.tags;
  }

  getCategory(): number {
    return this.categoryId;
  }

  getPreviousArticle(): number {
    return this.previousArticleId;
  }

  getNextArticle(): number {
    return this.nextArticleId;
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
    title: string,
    slug: string,
    text: string,
    titlePageImageId: number,
    previewHostedVideoUrl: string,
    previewMediaId: number,
    previewText: string,
    advertisement: string,
    tags: string[],
    categoryId: number,
    previousArticleId: number,
    nextArticleId: number,
    useMathJax: boolean,
    isPublished: boolean,
    releasedAt: Date,
    authorId: number,
  ): Promise<BlogArticleAggregate> {
    const article = new BlogArticleAggregate(
      id,
      title,
      slug,
      text,
      titlePageImageId,
      previewHostedVideoUrl,
      previewMediaId,
      previewText,
      advertisement,
      tags,
      categoryId,
      previousArticleId,
      nextArticleId,
      useMathJax,
      isPublished,
      releasedAt,
      authorId,
    );
    return article;
  }
}
