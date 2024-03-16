export class MediaDeletedEvent {
  constructor(private readonly mediaId: number) {}

  getMediaId(): number {
    return this.mediaId;
  }
}
